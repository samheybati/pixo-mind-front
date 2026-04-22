import type { CustomStep } from "./models";

export function createEmptyCustomSteps(): CustomStep[] {
    return [
        { shortTitle: "", title: "", description: "" },
        { shortTitle: "", title: "", description: "" },
        { shortTitle: "", title: "", description: "" },
    ];
}

export function isCustomStepsValid(steps: CustomStep[]) {
    return steps.every(
        (step) =>
            step.shortTitle.trim().length >= 2 &&
            step.title.trim().length >= 3 &&
            step.description.trim().length >= 10,
    );
}
