"use client";

import { useAuthUser } from "@/hooks/useAuthUser";
import { logout } from "@/lib/services/auth.service";
import { LayoutDashboard, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function Header() {
    const { user } = useAuthUser();
    const { resolvedTheme, setTheme } = useTheme();

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

    const currentTheme = (resolvedTheme ?? "dark") as "light" | "dark";
    const isThemeReady = resolvedTheme != null;

    const toggleTheme = () => setTheme(currentTheme === "dark" ? "light" : "dark");

    return (
        <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                <Link
                    href="/"
                    className="font-comfortaa font-semibold tracking-[0.25em] text-[var(--primary)]"
                >
                    Pixo Mind
                </Link>

                <div className="relative flex items-center gap-3" ref={dropdownRef}>
                    {isThemeReady ? (
                        <button
                            type="button"
                            className="icon-toggle"
                            onClick={toggleTheme}
                            aria-label={
                                currentTheme === "light"
                                    ? "Switch to dark mode"
                                    : "Switch to light mode"
                            }
                        >
                            {currentTheme === "light" ? (
                                <Moon size={18} className="text-indigo-600" />
                            ) : (
                                <Sun size={18} className="text-amber-500" />
                            )}
                        </button>
                    ) : (
                        <span className="icon-toggle" aria-hidden="true" />
                    )}

                    {user ? (
                        <>
                            <button
                                type="button"
                                className="header-avatar-btn"
                                onClick={() => setOpen((prev) => !prev)}
                                aria-label="Open user menu"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={user.photoURL || "/avatar.png"}
                                    alt="user"
                                    className="header-avatar"
                                />
                            </button>

                            {open && (
                                <div className="dropdown-menu">
                                    <div className="dropdown-menu-list">
                                        <Link
                                            href="/dashboard"
                                            className="dropdown-menu-item"
                                            onClick={() => setOpen(false)}
                                        >
                                            <div className="dropdown-menu-item-left">
                                                <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/25 to-amber-400/25 ring-1 ring-orange-500/30">
                                                    <LayoutDashboard
                                                        size={16}
                                                        className="text-orange-600 dark:text-orange-300"
                                                    />
                                                </span>
                                                <span className="dropdown-menu-item-label">
                                                    Dashboard
                                                </span>
                                            </div>
                                        </Link>

                                        <div className="dropdown-menu-divider" />

                                        <button
                                            type="button"
                                            className="dropdown-menu-item dropdown-menu-danger"
                                            onClick={async () => {
                                                setOpen(false);
                                                await logout();
                                            }}
                                        >
                                            <div className="dropdown-menu-item-left">
                                                <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500/15 to-red-500/15 ring-1 ring-red-500/20">
                                                    <LogOut
                                                        size={16}
                                                        className="text-red-600 dark:text-red-300"
                                                    />
                                                </span>
                                                <span className="dropdown-menu-item-label">
                                                    Logout
                                                </span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}
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
