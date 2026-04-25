"use client";

import { ChevronDown, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDefineAPlan } from "./useDefineAPlan";

const TIME_OPTIONS = [
    { value: "10", label: "10 minutes" },
    { value: "20", label: "20 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "45", label: "45 minutes" },
    { value: "60", label: "60 minutes" },
] as const;

const EMPTY_CUSTOM_STEP = {
    shortTitle: "",
    title: "",
    description: "",
} as const;

function clampInt(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

function PageShell({ children }: { children: React.ReactNode }) {
    return (
        <main className="glass-page">
            <div className="ambient-blobs" aria-hidden="true">
                <div className="ambient-blob ambient-blob--top" />
                <div className="ambient-blob ambient-blob--bottom-left" />
                <div className="ambient-blob ambient-blob--right" />
            </div>

            <div className="glass-shell">
                <section className="px-6 py-10 sm:px-10 md:col-span-2">{children}</section>
            </div>
        </main>
    );
}

function StatusMessage({ message }: { message: string }) {
    return (
        <PageShell>
            <div className="mx-auto max-w-6xl text-sm text-[var(--text-muted)]">{message}</div>
        </PageShell>
    );
}

function TimePerDaySelect({
    value,
    onChange,
}: {
    value: string;
    onChange: (value: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (!ref.current?.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div>
            <label htmlFor="time-per-day" className="mb-2 block text-sm font-medium">
                Time per day
            </label>
            <div className="relative" ref={ref}>
                <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-left outline-none focus:border-[var(--primary)]"
                    aria-haspopup="listbox"
                    aria-expanded={open}
                >
                    <span className="text-sm text-[var(--text)]">
                        {TIME_OPTIONS.find((o) => o.value === value)?.label ?? "Select time"}
                    </span>
                    <ChevronDown size={16} className="shrink-0 opacity-80" />
                </button>

                <select
                    id="time-per-day"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="sr-only"
                >
                    {TIME_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                {open ? (
                    <div className="dropdown-menu dropdown-menu--up" role="listbox">
                        <div className="dropdown-menu-list">
                            {TIME_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    className="dropdown-menu-item"
                                    onClick={() => {
                                        onChange(opt.value);
                                        setOpen(false);
                                    }}
                                >
                                    <div className="dropdown-menu-item-left">
                                        <span className="dropdown-menu-item-label">
                                            {opt.label}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

function StepsCountInput({
    value,
    onChange,
}: {
    value: number;
    onChange: (nextLen: number) => void;
}) {
    return (
        <div>
            <label htmlFor="custom-steps-count" className="mb-2 block text-sm font-medium">
                Steps (0 to 10)
            </label>
            <input
                id="custom-steps-count"
                type="number"
                min={0}
                max={10}
                inputMode="numeric"
                value={value}
                onChange={(e) => {
                    const parsed = Number.parseInt(e.target.value || "0", 10);
                    onChange(Number.isFinite(parsed) ? clampInt(parsed, 0, 10) : 0);
                }}
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 outline-none placeholder:text-gray-400 focus:border-[var(--primary)]"
            />
        </div>
    );
}

function GuideAside() {
    return (
        <aside className="space-y-6">
            <div className="relative">
                <div className="absolute inset-0 -z-10 rounded-[28px] bg-gradient-to-br from-orange-500/10 to-amber-400/10 blur-2xl" />

                <div className="rounded-[28px] border border-[var(--border)] bg-[var(--bg)] p-6">
                    <div className="space-y-3 text-sm leading-7 text-[var(--text-muted)]">
                        <p className="text-lg font-bold text-[var(--text)] font-comfortaa">
                            Create your plan
                        </p>

                        <div className="grid gap-4 pt-2">
                            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-4">
                                <p className="text-[var(--text)] font-comfortaa">
                                    AI-generated plan (10 steps)
                                </p>
                                <p className="mt-1 text-sm text-[var(--text-muted)]">
                                    Answer a few questions and we’ll create a realistic 10-step
                                    checklist based on your goal and your time per day.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-4">
                                <p className="text-[var(--text)] font-comfortaa">
                                    Custom plan (you write the steps)
                                </p>
                                <p className="mt-1 text-sm text-[var(--text-muted)]">
                                    Choose how many steps you want (0–10) using the Steps field,
                                    then fill in the title and details for each step yourself.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-4">
                                <p className="text-[var(--text)] font-comfortaa">
                                    Multiple plans, separate progress
                                </p>
                                <p className="mt-1 text-sm text-[var(--text-muted)]">
                                    Keep more than one plan at the same time and switch between them
                                    anytime—each plan’s progress is tracked separately.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default function DefineAPlanPage() {
    const {
        user,
        mode,
        setMode,
        title,
        setTitle,
        description,
        setDescription,
        timePerDay,
        setTimePerDay,
        loading,
        loadingQuestions,
        intakeQuestions,
        intakeAnswers,
        setIntakeAnswers,
        customSteps,
        setCustomSteps,
        isFormValid,
        isCustomValid,
        submit,
    } = useDefineAPlan();

    const isCustomMode = mode === "custom";

    const setCustomStepsLength = (nextLen: number) => {
        setCustomSteps((prev) => {
            const clampedLen = clampInt(nextLen, 0, 10);
            const next = prev.slice(0, clampedLen);
            while (next.length < clampedLen) {
                next.push({ ...EMPTY_CUSTOM_STEP });
            }
            return next;
        });
    };

    const handleModeChange = (nextMode: "ai" | "custom") => {
        setMode(nextMode);
        if (nextMode === "custom" && customSteps.length === 0) {
            setCustomStepsLength(3);
        }
    };

    const isSubmitDisabled = useMemo(() => {
        return (
            !isFormValid ||
            !isCustomValid ||
            loading ||
            (mode === "ai" && !intakeQuestions && loadingQuestions) ||
            (mode === "ai" &&
                !!intakeQuestions &&
                intakeQuestions.some((q) => !(intakeAnswers[q.id] ?? "").trim()))
        );
    }, [
        intakeAnswers,
        intakeQuestions,
        isCustomValid,
        isFormValid,
        loading,
        loadingQuestions,
        mode,
    ]);

    if (user === undefined) {
        return <StatusMessage message="Checking your session..." />;
    }

    if (user === null) {
        return <StatusMessage message="Redirecting to login..." />;
    }

    return (
        <PageShell>
            <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="w-full rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl sm:p-8">
                    <div className="mb-8">
                        <h1 className="mt-5 text-3xl font-bold sm:text-4xl font-comfortaa text-center">
                            Build a habit you can keep
                        </h1>

                        <p className="mt-3 max-w-2xl leading-8 text-[var(--text-muted)]">
                            Name the habit you want to lock in, describe what “success” looks like,
                            and Pixo Mind will turn it into clear steps you can follow — with AI or
                            your own rules.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-6">
                            <div>
                                <p className="mb-2 block text-sm font-medium">Plan type</p>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3">
                                        <span className="text-sm flex items-center font-semibold text-[var(--text)]">
                                            <Sparkles size={14} className="mr-2" /> AI generate
                                        </span>
                                        <input
                                            type="radio"
                                            name="plan-mode"
                                            value="ai"
                                            checked={mode === "ai"}
                                            onChange={() => handleModeChange("ai")}
                                        />
                                    </label>

                                    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3">
                                        <span className="text-sm font-semibold text-[var(--text)]">
                                            Custom (step-by-step)
                                        </span>
                                        <input
                                            type="radio"
                                            name="plan-mode"
                                            value="custom"
                                            checked={isCustomMode}
                                            onChange={() => handleModeChange("custom")}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="plan-title"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Plan title
                                </label>
                                <input
                                    id="plan-title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Learn English, Lose weight, Morning routine"
                                    className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 outline-none placeholder:text-gray-400 focus:border-[var(--primary)]"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="plan-description"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    What exactly do you want to achieve?
                                </label>
                                <textarea
                                    id="plan-description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe your goal clearly. For example: I want to improve my speaking skills and feel more confident in daily English conversations."
                                    rows={5}
                                    className="w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 outline-none placeholder:text-gray-400 focus:border-[var(--primary)]"
                                />
                            </div>

                            <TimePerDaySelect value={timePerDay} onChange={setTimePerDay} />

                            {isCustomMode ? (
                                <StepsCountInput
                                    value={customSteps.length}
                                    onChange={setCustomStepsLength}
                                />
                            ) : null}

                            {mode === "ai" && intakeQuestions ? (
                                <div className="grid gap-4">
                                    {intakeQuestions.map((q) => (
                                        <div key={q.id} className="grid gap-2">
                                            <p className="text-sm font-semibold text-[var(--text)]">
                                                {q.question}
                                            </p>
                                            <label className="block text-xs font-medium text-[var(--text-muted)]">
                                                {q.inputLabel}
                                            </label>
                                            <input
                                                type="text"
                                                value={intakeAnswers[q.id] ?? ""}
                                                onChange={(e) =>
                                                    setIntakeAnswers((prev) => ({
                                                        ...prev,
                                                        [q.id]: e.target.value,
                                                    }))
                                                }
                                                placeholder={q.placeholder}
                                                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-[var(--primary)]"
                                            />
                                            {q.helperText ? (
                                                <p className="text-xs text-[var(--text-muted)]">
                                                    {q.helperText}
                                                </p>
                                            ) : null}
                                        </div>
                                    ))}
                                </div>
                            ) : null}

                            {isCustomMode ? (
                                <div className="grid gap-4">
                                    <p className="text-sm font-medium">Your steps</p>

                                    {customSteps.map((step, index) => (
                                        <div
                                            key={index}
                                            className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4"
                                        >
                                            <p className="text-sm font-semibold text-[var(--text)]">
                                                Step {index + 1}
                                            </p>

                                            <div className="mt-3 grid gap-3">
                                                <input
                                                    type="text"
                                                    value={step.shortTitle}
                                                    onChange={(e) => {
                                                        const next = [...customSteps];
                                                        next[index] = {
                                                            ...next[index],
                                                            shortTitle: e.target.value,
                                                        };
                                                        setCustomSteps(next);
                                                    }}
                                                    placeholder="Short label (2–4 words)"
                                                    className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 outline-none placeholder:text-gray-400 focus:border-[var(--primary)]"
                                                />

                                                <input
                                                    type="text"
                                                    value={step.title}
                                                    onChange={(e) => {
                                                        const next = [...customSteps];
                                                        next[index] = {
                                                            ...next[index],
                                                            title: e.target.value,
                                                        };
                                                        setCustomSteps(next);
                                                    }}
                                                    placeholder="Step title"
                                                    className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 outline-none placeholder:text-gray-400 focus:border-[var(--primary)]"
                                                />

                                                <textarea
                                                    value={step.description}
                                                    onChange={(e) => {
                                                        const next = [...customSteps];
                                                        next[index] = {
                                                            ...next[index],
                                                            description: e.target.value,
                                                        };
                                                        setCustomSteps(next);
                                                    }}
                                                    rows={3}
                                                    placeholder="What will you do in this step?"
                                                    className="w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 outline-none placeholder:text-gray-400 focus:border-[var(--primary)]"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : null}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitDisabled}
                            className="w-full rounded-2xl bg-[var(--primary)] px-6 py-3.5 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading || loadingQuestions ? (
                                <div className="flex items-center justify-center gap-3">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    <div className="flex flex-col items-start">
                                        <span className="text-sm font-semibold leading-none">
                                            {loadingQuestions
                                                ? "Generating questions..."
                                                : "Generating your plan..."}
                                        </span>
                                        {!loadingQuestions ? (
                                            <span className="mt-1 text-[11px] leading-none text-white/80">
                                                Based on your goal and answers
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                            ) : (
                                <span className="text-sm font-semibold">
                                    {isCustomMode
                                        ? "Save plan"
                                        : mode === "ai" && !intakeQuestions
                                          ? "Continue"
                                          : "Generate plan"}
                                </span>
                            )}
                        </button>
                    </form>
                </div>

                <GuideAside />
            </div>
        </PageShell>
    );
}
