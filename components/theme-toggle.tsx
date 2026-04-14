"use client";

import {useTheme} from "next-themes";
import {useEffect, useState} from "react";

export function ThemeToggle() {
    const {theme, setTheme} = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDark = theme === "dark";

    const handleToggle = (e: React.MouseEvent) => {
        // جلوگیری از کلیک والد (خیلی مهم برای dropdown)
        e.stopPropagation();

        setTheme(isDark ? "light" : "dark");
    };

    return (
        <button
            type="button"
            aria-label="Toggle theme"
            onClick={handleToggle}
            className={`theme-switch ${isDark ? "theme-switch-dark" : ""}`}
        >
            <span className="theme-switch-thumb"/>
        </button>
    );
}
