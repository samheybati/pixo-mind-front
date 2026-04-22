"use client";

import { ChevronDown, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDefineAPlan } from "./useDefineAPlan";

const TIME_OPTIONS = [
    { value: "10", label: "10 minutes" },
    { value: "20", label: "20 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "45", label: "45 minutes" },
    { value: "60", label: "60 minutes" },
] as const;

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

    const [timeMenuOpen, setTimeMenuOpen] = useState(false);
    const timeMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (!timeMenuRef.current?.contains(e.target as Node)) {
                setTimeMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (user === undefined) {
        return (
            <main className="flex min-h-full items-center justify-center px-6 py-10">
                <div className="w-full max-w-xl rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-xl">
                    Checking your session...
                </div>
            </main>
        );
    }

    if (user === null) {
        return (
            <main className="flex min-h-full items-center justify-center px-6 py-10">
                <div className="w-full max-w-xl rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-xl">
                    Redirecting to login...
                </div>
            </main>
        );
    }

    return (
        <main className="glass-page">
            <div className="ambient-blobs" aria-hidden="true">
                <div className="ambient-blob ambient-blob--top" />
                <div className="ambient-blob ambient-blob--bottom-left" />
                <div className="ambient-blob ambient-blob--right" />
            </div>

            <div className="w-full max-w-3xl rounded-[32px] border border-[var(--border)] bg-[var(--card)] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.08)] sm:p-10">
                <div className="mb-8">
                    <h1 className="mt-5 text-3xl font-bold sm:text-4xl font-comfortaa text-center">
                        Build a habit you can keep
                    </h1>

                    <p className="mt-3 max-w-2xl leading-8 text-[var(--text-muted)]">
                        Name the habit you want to lock in, describe what “success” looks like, and
                        Pixo Mind will turn it into clear steps you can follow — with AI or your own
                        rules.
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
                                        onChange={() => setMode("ai")}
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
                                        checked={mode === "custom"}
                                        onChange={() => setMode("custom")}
                                    />
                                </label>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="plan-title" className="mb-2 block text-sm font-medium">
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

                        <div>
                            <label
                                htmlFor="time-per-day"
                                className="mb-2 block text-sm font-medium"
                            >
                                Time per day
                            </label>
                            <div className="relative" ref={timeMenuRef}>
                                <button
                                    type="button"
                                    onClick={() => setTimeMenuOpen((prev) => !prev)}
                                    className="flex w-full items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-left outline-none focus:border-[var(--primary)]"
                                    aria-haspopup="listbox"
                                    aria-expanded={timeMenuOpen}
                                >
                                    <span className="text-sm text-[var(--text)]">
                                        {TIME_OPTIONS.find((o) => o.value === timePerDay)?.label ??
                                            "Select time"}
                                    </span>
                                    <ChevronDown size={16} className="shrink-0 opacity-80" />
                                </button>

                                {/* Keep native select for form semantics */}
                                <select
                                    id="time-per-day"
                                    value={timePerDay}
                                    onChange={(e) => setTimePerDay(e.target.value)}
                                    className="sr-only"
                                >
                                    {TIME_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>

                                {timeMenuOpen ? (
                                    <div className="dropdown-menu dropdown-menu--up" role="listbox">
                                        <div className="dropdown-menu-list">
                                            {TIME_OPTIONS.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    className="dropdown-menu-item"
                                                    onClick={() => {
                                                        setTimePerDay(opt.value);
                                                        setTimeMenuOpen(false);
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

                        {mode === "custom" ? (
                            <div className="grid gap-4">
                                <p className="text-sm font-medium">Your 3 steps</p>

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
                        disabled={
                            !isFormValid ||
                            !isCustomValid ||
                            loading ||
                            (mode === "ai" && !intakeQuestions && loadingQuestions) ||
                            (mode === "ai" &&
                                !!intakeQuestions &&
                                intakeQuestions.some((q) => !(intakeAnswers[q.id] ?? "").trim()))
                        }
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
                                {mode === "ai" && !intakeQuestions ? "Continue" : "Generate plan"}
                            </span>
                        )}
                    </button>
                </form>
            </div>
        </main>
    );
}
