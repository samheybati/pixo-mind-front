import { app } from "@/lib/firebase/client";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

import type { GeneratedPlan, GeneratePlanParams, IntakeQuestion } from "./types";

export type { GeneratedPlan, GeneratePlanParams, IntakeQuestion } from "./types";

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
    const intakeBlock =
        intakeAnswers && intakeAnswers.length
            ? `
User answers to your intake questions:
${intakeAnswers
    .map((qa, idx) => `Q${idx + 1}: ${qa.question}\nA${idx + 1}: ${qa.answer}`)
    .join("\n\n")}
`
            : "";

    const prompt = `
You are an expert habit coach and motivational guide.

Create a simple 3-step habit plan for this user.

Plan title: ${title}

User intention:
${description}

Daily time available: about ${timePerDay} minutes per day
${intakeBlock}

Requirements:
- Write a short encouraging summary in 4 to 5 sentences.
- Then create exactly 3 steps.
- Each step must be realistic, actionable, beginner-friendly, and fit within the user's daily available time.
- Focus on consistency, momentum, habit formation, and emotional encouragement, not intensity.
- The plan should feel progressive across the 3 steps, starting easy and becoming slightly more intentional.
- Each step should feel supportive, practical, and motivating.

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
    }
  ]
}
`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    try {
        const parsed = parseJsonObjectFromText(rawText) as RawGeneratedPlan;

        if (
            !parsed ||
            typeof parsed.summary !== "string" ||
            !Array.isArray(parsed.tasks) ||
            parsed.tasks.length !== 3
        ) {
            throw new Error("AI returned invalid plan structure");
        }

        const normalizedTasks = parsed.tasks.map((task: unknown, index: number) => {
            const raw = (task ?? {}) as RawGeneratedPlanTask;

            return {
                day: Number(raw.day ?? index + 1),
                shortTitle: normalizeString(raw.shortTitle),
                title: normalizeString(raw.title),
                description: normalizeString(raw.description),
            };
        });

        const finalPlan: GeneratedPlan = {
            summary: parsed.summary.trim(),
            tasks: normalizedTasks,
        };

        return finalPlan;
    } catch (error) {
        console.error("AI parse failed:", error);
        throw new Error("AI returned invalid JSON");
    }
}

/**
 * Backward-compatible alias. Prefer `generatePlan`.
 */
export const generateLevelPlan = generatePlan;
