import type {Metadata} from "next";
import "./globals.css";
import {ThemeProvider} from "@/components/theme-provider";
import {Header} from "@/components/layout/header";

export const metadata: Metadata = {
    title: "HabitForge",
    description: "Turn goals into lasting habits",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className="bg-[var(--bg)] text-[var(--text)] antialiased overflow-hidden">
        <ThemeProvider>
            <Header/>
            {children}
        </ThemeProvider>
        </body>
        </html>
    );
}
