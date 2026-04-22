import { app } from "@/lib/firebase/client";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

import type { GeneratedPlan, GeneratePlanParams, IntakeQuestion,GeneratedPlanTask } from "./types";

export type { GeneratedPlan, GeneratePlanParams, IntakeQuestion, } from "./types";

const ai = getAI(app, { backend: new GoogleAIBackend() });

const model = getGenerativeModel(ai, {
    model: "gemini-2.5-flash-lite",
});

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

function parseJsonObjectFromText(text: string): unknown {
    const cleaned = text.trim();

    try {
        return JSON.parse(cleaned) as unknown;
    } catch {
        // Sometimes models include extra text around JSON; salvage the first object.
        const match = cleaned.match(/\{[\s\S]*\}/);
        if (!match) throw new Error("No JSON object found in AI response");
        return JSON.parse(match[0]) as unknown;
    }
}

type RawIntakeQuestion = {
    id?: unknown;
    question?: unknown;
    inputLabel?: unknown;
    placeholder?: unknown;
    helperText?: unknown;
};

type RawIntakeQuestionsResult = {
    questions?: unknown;
};

function normalizeString(value: unknown) {
    return typeof value === "string" ? value.trim() : "";
}

export async function generateIntakeQuestions({
    title,
    description,
    timePerDay,
}: {
    title: string;
    description: string;
    timePerDay: string;
}): Promise<IntakeQuestion[]> {
    const prompt = `
You are a habit coach.

Based on the user's goal, generate exactly 3 short intake questions you need to create a realistic plan.

Plan title: ${title}
User intention:
${description}
Daily time available: about ${timePerDay} minutes per day

Requirements:
- Questions MUST be in English.
- Ask questions that help tailor the plan to the user's current ability and real constraints (context, limitations, environment, available tools).
- One question MUST be about current ability/starting point (e.g. running distance/time today).
- Do NOT ask about "commitment", "discipline", "consistency", or motivation.
- Do NOT ask vague self-rating questions like "how committed are you?".
- Prefer concrete, measurable questions (what can you do now, what limits you, what setup you have).
- Keep each question short and practical.
- Free-text answers only.
- Do NOT ask how much time per day the user can spend (they already provided it).

Rules:
- Return valid JSON only
- Do not use markdown
- Do not wrap in backticks

Use this JSON shape exactly:
{
  "questions": [
    { "id": "q1", "question": "string", "inputLabel": "string", "placeholder": "string", "helperText": "string" },
    { "id": "q2", "question": "string", "inputLabel": "string", "placeholder": "string", "helperText": "string" },
    { "id": "q3", "question": "string", "inputLabel": "string", "placeholder": "string", "helperText": "string" }
  ]
}
`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    const parsed = parseJsonObjectFromText(rawText) as RawIntakeQuestionsResult;

    if (!parsed || !Array.isArray(parsed.questions) || parsed.questions.length !== 3) {
        throw new Error("AI returned invalid intake questions");
    }

    const normalized = (parsed.questions as unknown[]).map((q, idx) => {
        const raw = (q ?? {}) as RawIntakeQuestion;

        const id = normalizeString(raw.id) || `q${idx + 1}`;
        const question = normalizeString(raw.question);
        const inputLabel = normalizeString(raw.inputLabel);
        const placeholder = normalizeString(raw.placeholder);
        const helperText = normalizeString(raw.helperText);

        if (!question || !inputLabel || !placeholder) {
            throw new Error("AI returned invalid intake question fields");
        }

        return { id, question, inputLabel, placeholder, helperText };
    });

    return normalized;
}

export async function generatePlan({
    title,
    description,
    timePerDay,
    intakeAnswers,
}: GeneratePlanParams): Promise<GeneratedPlan> {
    const intakeBlock = intakeAnswers?.length
        ? `
User answers:
${intakeAnswers
    .map((qa, idx) => `${idx + 1}. ${qa.question}\nAnswer: ${qa.answer}`)
    .join("\n\n")}
`
        : "";

        const prompt = `
        You are an expert habit coach and motivational guide.
        
        Create a simple 10-day habit plan for this user.
        
        Plan title: ${title}
        
        User intention:
        ${description}
        
        Daily time available: about ${timePerDay} minutes per day
        ${intakeBlock}
        
        Requirements:
        - Write a short encouraging summary in 4 to 5 sentences.
        - Create exactly 10 steps, one for each day.
        - Each step must describe what the user should do on that day.
        - Each task must fit within the user's daily available time.
        - DO NOT mention or suggest any specific number of minutes or time duration in the description.
        - DO NOT use phrases like "for 10 minutes", "for 30 minutes", etc.
        - Instead, keep the task naturally short and aligned with the user's available time.
        
        - Focus on consistency, momentum, and habit formation, not intensity.
        - Start easy and become slightly more intentional over time.
        
        For each step, return:
        - "shortTitle": a short UI-friendly label in 2 to 4 words
        - "title": a clear actionable title in 4 to 8 words
        - "description": a warm and supportive daily instruction in 4 to 6 sentences
        
        Description rules:
        - Speak directly to the user
        - Clearly say what to do today
        - Do NOT mention any specific time duration
        - Briefly explain why today's step matters
        - Use positive, natural, human language
        - Keep it practical, encouraging, and easy to understand
        - Avoid robotic or repetitive phrasing
        
        Rules:
        - Return valid JSON only
        - Do not use markdown
        - Do not wrap the JSON in backticks
        
        Use this JSON shape exactly:
        {
          "summary": "string",
          "tasks": [
            {
              "shortTitle": "string",
              "title": "string",
              "description": "string"
            }
          ]
        }
        `;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    try {
        const parsed = parseJsonObjectFromText(rawText) as {
            summary?: unknown;
            tasks?: unknown;
        };

        if (
            !parsed ||
            typeof parsed.summary !== "string" ||
            !Array.isArray(parsed.tasks) ||
            parsed.tasks.length !== 10
        ) {
            throw new Error("AI returned invalid plan structure");
        }

        const tasks: GeneratedPlanTask[] = parsed.tasks.map((task: unknown, index: number) => {
            const raw = (task ?? {}) as {
                day?: unknown;
                shortTitle?: unknown;
                title?: unknown;
                description?: unknown;
            };

            const shortTitle = normalizeString(raw.shortTitle);
            const title = normalizeString(raw.title);
            const description = normalizeString(raw.description);

            if (!shortTitle || !title || !description) {
                throw new Error(`AI returned invalid task at index ${index}`);
            }

            return {
                day: Number(raw.day ?? index + 1),
                shortTitle,
                title,
                description,
            };
        });

        return {
            summary: parsed.summary.trim(),
            tasks,
        };
    } catch (error) {
        console.error("AI parse failed:", error);
        throw new Error("AI returned invalid JSON");
    }
}

