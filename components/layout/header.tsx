"use client";

import {useEffect, useRef, useState} from "react";
import Link from "next/link";
import {useTheme} from "next-themes";
import {ThemeToggle} from "@/components/theme-toggle";
import {logout} from "@/lib/auth";
import {useAuthUser} from "@/hooks/useAuthUser";

export function Header() {
    const user = useAuthUser();
    const {theme, setTheme} = useTheme();

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (!dropdownRef.current?.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const currentTheme = theme ?? "light";

    return (
        <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                <Link
                    href="/"
                    className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]"
                >
                    HabitForge
                </Link>

                <div className="relative flex items-center gap-3" ref={dropdownRef}>
                    {user ? (
                        <>
                            <button
                                type="button"
                                className="header-avatar-btn"
                                onClick={() => setOpen((prev) => !prev)}
                                aria-label="Open user menu"
                            >
                                <img
                                    src={user.photoURL || "/avatar.png"}
                                    alt="user"
                                    className="header-avatar"
                                />
                            </button>

                            {open && (
                                <div className="header-menu">
                                    <div className="header-menu-list">
                                        <Link
                                            href="/dashboard"
                                            className="header-menu-item"
                                            onClick={() => setOpen(false)}
                                        >
                                            <div className="header-menu-item-left">
                                                <span>📊</span>
                                                <span className="header-menu-item-label">Dashboard</span>
                                            </div>
                                        </Link>

                                        <div
                                            className="header-menu-item"
                                            onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ") {
                                                    setTheme(currentTheme === "dark" ? "light" : "dark");
                                                }
                                            }}
                                        >
                                            <div className="header-menu-item-left">
                                                <span>{currentTheme === "dark" ? "🌙" : "☀️"}</span>
                                                <span className="header-menu-item-label">
                     {currentTheme === "dark" ? "Dark mode" : "Light mode"}
        </span>
                                            </div>

                                            <ThemeToggle/>
                                        </div>

                                        <div className="header-menu-divider"/>

                                        <button
                                            type="button"
                                            className="header-menu-item header-menu-danger"
                                            onClick={async () => {
                                                setOpen(false);
                                                await logout();
                                            }}
                                        >
                                            <div className="header-menu-item-left">
                                                <span>↩</span>
                                                <span className="header-menu-item-label">Logout</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>)}
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
