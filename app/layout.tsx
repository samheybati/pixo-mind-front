import { Header } from "@/components/layout/header";
import { ThemeProvider } from "@/components/providers/theme-provider";
import type { Metadata } from "next";
import "./globals.css";

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
            <body className="bg-[var(--bg)] text-[var(--text)] antialiased">
                <ThemeProvider>
                    <div className="flex h-screen flex-col">
                        <Header />
                        <div className="flex-1 overflow-y-auto">{children}</div>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
