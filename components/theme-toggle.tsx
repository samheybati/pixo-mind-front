"use client";

import {Moon, Sun} from "lucide-react";
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

    return (
        <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm backdrop-blur transition hover:scale-[1.02] dark:border-white/10 dark:bg-white/10 dark:text-white"
        >
            {isDark ? <Sun size={16}/> : <Moon size={16}/>}
            {isDark ? "Light" : "Dark"}
        </button>
    );
}
