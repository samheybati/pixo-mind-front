export type IntakeAnswer = {
    question: string;
    answer: string;
};

export type GeneratePlanParams = {
    title: string;
    description: string;
    timePerDay: string;
    intakeAnswers?: IntakeAnswer[];
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

export type IntakeQuestion = {
    id: string;
    question: string;
    inputLabel: string;
    placeholder: string;
    helperText?: string;
};
