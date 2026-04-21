import { Header } from "@/components/layout/header";
import { ThemeProvider } from "@/components/providers/theme-provider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Pixo Mind",
    description:
        "Lock in one habit for real life — create your own challenge or get a clear AI plan in minutes.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`bg-[var(--bg)] text-[var(--text)] antialiased`}>
                <ThemeProvider>
                    <div className="flex h-dvh flex-col overflow-hidden">
                        <Header />
                        <div className="flex-1 overflow-auto">{children}</div>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
