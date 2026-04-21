"use client";

import {useTheme} from "next-themes";

export function ThemeToggle() {
    const {resolvedTheme, setTheme} = useTheme();
    const isDark = (resolvedTheme ?? "light") === "dark";

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

