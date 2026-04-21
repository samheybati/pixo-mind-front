import {getAI, getGenerativeModel, GoogleAIBackend} from "firebase/ai";
import {app} from "@/lib/firebase/client";

const ai = getAI(app, {backend: new GoogleAIBackend()});

const model = getGenerativeModel(ai, {
    model: "gemini-2.5-flash-lite",
});

type GeneratePlanParams = {
    title: string;
    description: string;
    timePerDay: string;
    level: string;
};

export type GeneratedPlanTask = {
    day: number;
    shortTitle: string;
    title: string;
    description: string;
};

export type GeneratedPlan = {
    summary: string;
    tasks: GeneratedPlanTask[];
};

type RawGeneratedPlan = {
    summary?: unknown;
    tasks?: unknown;
};

type RawGeneratedPlanTask = {
    day?: unknown;
    shortTitle?: unknown;
    title?: unknown;
    description?: unknown;
};

function extractJson(text: string) {
    const cleaned = text.trim();

    try {
        return JSON.parse(cleaned) as unknown;
    } catch {
        const match = cleaned.match(/\{[\s\S]*\}/);
        if (!match) {
            throw new Error("No JSON object found in AI response");
        }

        return JSON.parse(match[0]) as unknown;
    }
}

export async function generateLevelPlan({
    title,
    description,
    timePerDay,
    level,
}: GeneratePlanParams): Promise<GeneratedPlan> {
    const prompt = `
You are an expert habit coach and motivational guide.

Create a 5-day habit plan for this user.

Plan title: ${title}

User intention:
${description}

Daily time available: about ${timePerDay} minutes per day
User level: ${level}

Requirements:
- Write a short encouraging summary in 4 to 5 sentences.
- Then create exactly 5 daily tasks, one for each day.
- Each task must be realistic, actionable, beginner-friendly, and fit within the user's daily available time.
- Focus on consistency, momentum, habit formation, and emotional encouragement, not intensity.
- The plan should feel progressive across the 5 days, starting easy and becoming slightly more intentional.
- Each day should feel supportive, practical, and motivating.

For each task, return:
- "shortTitle": a very short UI-friendly label in 2 to 4 words
- "title": a clear task title in 4 to 8 words
- "description": a supportive and motivating explanation in 4 to 6 sentences

Description rules:
- The description must be a little longer, warm, and encouraging
- Explain clearly what the user should do today
- Briefly explain why this step matters
- Use positive, natural, human language
- Help the user feel that the task is manageable and worth doing
- Avoid sounding robotic, repetitive, or too generic
- Avoid repeating the exact same motivational sentence across tasks
-- Write the description in a tone that feels like a supportive coach speaking directly to the user

Rules:
- shortTitle must be concise and easy to scan in cards
- title must be actionable
- description must be practical, emotionally encouraging, and easy to understand
- Return valid JSON only
- Do not use markdown
- Do not wrap the JSON in backticks

Use this JSON shape exactly:
{
  "summary": "string",
  "tasks": [
    {
      "day": 1,
      "shortTitle": "string",
      "title": "string",
      "description": "string"
    },
    {
      "day": 2,
      "shortTitle": "string",
      "title": "string",
      "description": "string"
    },
    {
      "day": 3,
      "shortTitle": "string",
      "title": "string",
      "description": "string"
    },
    {
      "day": 4,
      "shortTitle": "string",
      "title": "string",
      "description": "string"
    },
    {
      "day": 5,
      "shortTitle": "string",
      "title": "string",
      "description": "string"
    }
  ]
}
`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    console.log("RAW AI RESPONSE:", rawText);

    try {
        const parsed = extractJson(rawText) as RawGeneratedPlan;

        if (
            !parsed ||
            typeof parsed.summary !== "string" ||
            !Array.isArray(parsed.tasks) ||
            parsed.tasks.length !== 5
        ) {
            throw new Error("AI returned invalid plan structure");
        }

        const normalizedTasks = parsed.tasks.map((task: unknown, index: number) => {
            const raw = (task ?? {}) as RawGeneratedPlanTask;

            return {
                day: Number(raw.day ?? index + 1),
                shortTitle: String(raw.shortTitle ?? "").trim(),
                title: String(raw.title ?? "").trim(),
                description: String(raw.description ?? "").trim(),
            };
        });

        const finalPlan: GeneratedPlan = {
            summary: parsed.summary.trim(),
            tasks: normalizedTasks,
        };

        console.log("PARSED AI RESPONSE:", finalPlan);
        return finalPlan;
    } catch (error) {
        console.error("JSON PARSE FAILED:", error);
        throw new Error("AI returned invalid JSON");
    }
}

