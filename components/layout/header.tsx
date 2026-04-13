"use client";

import Link from "next/link";
import {ThemeToggle} from "@/components/theme-toggle";

export function Header() {
    return (
        <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                <Link
                    href="/"
                    className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]"
                >
                    HabitForge
                </Link>

                <ThemeToggle/>
            </div>
        </header>
    );
}
