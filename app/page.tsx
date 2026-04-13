import Link from "next/link";
import {Flame, Sparkles, Trophy} from "lucide-react";

export default function HomePage() {
  return (
      <main className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-[var(--bg)] text-[var(--text)]">
        <div
            className="absolute inset-0 -z-20 bg-gradient-to-b from-orange-50 via-amber-50 to-[var(--bg)] dark:from-[#140d08] dark:via-[#120d09] dark:to-[var(--bg)]"/>
        <div
            className="absolute left-1/2 top-24 -z-10 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-orange-400/15 blur-3xl dark:bg-orange-500/10"/>

        <section className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl items-center px-6 py-16">
          <div className="w-full max-w-3xl">
            <div
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--primary)] shadow-sm backdrop-blur">
              <Sparkles size={15}/>
              AI habit building with streaks and XP
            </div>

            <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Turn goals into
              <span
                  className="mt-1 block bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent dark:from-orange-400 dark:to-amber-300 pb-5">
              lasting habits
            </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">
              HabitForge helps you turn vague goals into simple daily actions,
              stay consistent with streaks, and build momentum with AI-guided
              plans.
            </p>

            <div className="mt-5 flex flex-col gap-4 sm:flex-row">
              <Link
                  href="/onboarding"
                  className="rounded-2xl bg-[var(--primary)] px-6 py-3.5 text-center font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:opacity-95"
              >
                Start Your Plan
              </Link>

              <Link
                  href="/dashboard"
                  className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-6 py-3.5 text-center font-semibold text-[var(--text)] shadow-sm backdrop-blur transition hover:bg-white/70 dark:hover:bg-white/10"
              >
                View Demo Dashboard
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-[var(--text-muted)]">
              <div className="flex items-center gap-2">
                <Flame className="text-orange-500" size={16}/>
                Daily streak tracking
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="text-amber-500" size={16}/>
                XP and progress rewards
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="text-[var(--primary)]" size={16}/>
                AI-generated plans
              </div>
            </div>
          </div>
        </section>
      </main>
  );
}
