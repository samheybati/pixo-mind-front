import Link from "next/link";
import {CircleCheckBig, Flame, Sparkles, Trophy} from "lucide-react";

export default function HomePage() {
  return (
      <main className="relative flex min-h-full items-center justify-center bg-[var(--bg)] px-6 py-10">
        <div
            className="absolute inset-0 -z-20 bg-gradient-to-b from-orange-50/80 via-[var(--bg)] to-[var(--bg)] dark:from-[#1a120c] dark:via-[var(--bg)] dark:to-[var(--bg)]"/>
        <div
            className="absolute left-1/2 top-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-400/10 blur-3xl dark:bg-orange-500/10"/>

        <div
            className="w-full max-w-5xl rounded-[32px] border border-[var(--border)] bg-[var(--card)] px-6 py-8 shadow-[0_20px_80px_rgba(0,0,0,0.08)] backdrop-blur sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            {/* Left */}
            <div>
              <div
                  className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--primary)]">
                <Sparkles size={14}/>
                AI habit building with streaks and XP
              </div>

              <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                Turn goals into
                <span
                    className="block bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent dark:from-orange-400 dark:to-amber-300">
                lasting habits
              </span>
              </h1>

              <p className="mt-5 max-w-xl  leading-8 text-[var(--text-muted)]">
                HabitForge helps you turn vague goals into simple daily actions,
                stay consistent with streaks, and build momentum with AI-guided plans.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                    href="/onboarding"
                    className="rounded-2xl bg-[var(--primary)] px-6 py-3.5 text-center font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:opacity-95"
                >
                  Create Your New Plan
                </Link>

                <Link
                    href="/dashboard"
                    className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-6 py-3.5 text-center font-semibold text-[var(--text)] transition hover:bg-white/70 dark:hover:bg-white/10"
                >
                  View Dashboard
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-5 text-sm text-[var(--text-muted)]">
                <div className="flex items-center gap-2">
                  <Flame className="text-orange-500" size={16}/>
                  Daily streak tracking
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="text-amber-500" size={16}/>
                  XP rewards
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="text-[var(--primary)]" size={16}/>
                  AI-generated plans
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="relative">
              <div
                  className="absolute inset-0 -z-10 rounded-[28px] bg-gradient-to-br from-orange-500/10 to-amber-400/10 blur-2xl"/>

              <div className="rounded-[28px] border border-[var(--border)] bg-[var(--bg)] p-6">
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <p className="text-sm text-[var(--text-muted)]">Consistency</p>
                    <h2 className="mt-1 text-2xl font-bold">12 / 66 days</h2>
                  </div>

                  <div className="rounded-2xl bg-[var(--primary)] px-3 py-2 text-sm font-semibold text-white">
                    +120 XP
                  </div>
                </div>

                <div className="mb-6 flex items-center justify-center">
                  <div
                      className="flex h-36 w-36 items-center justify-center rounded-full border-[10px] border-orange-200 dark:border-orange-900/50">
                    <div
                        className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-[var(--card)] text-center shadow-sm">
                      <span className="text-3xl font-bold">18%</span>
                      <span className="text-xs text-[var(--text-muted)]">progress</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    "10-minute walk",
                    "Drink water",
                    "Read 10 minutes",
                  ].map((item, index) => (
                      <div
                          key={item}
                          className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <CircleCheckBig
                              size={18}
                              className={index === 0 ? "text-green-500" : "text-[var(--text-muted)]"}
                          />
                          <span className="text-sm font-medium">{item}</span>
                        </div>
                        <span className="text-xs text-[var(--text-muted)]">+20 XP</span>
                      </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}
