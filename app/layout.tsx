import { Header } from "@/components/layout/header";
import { ThemeProvider } from "@/components/providers/theme-provider";
import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});

const sora = Sora({
    subsets: ["latin"],
    variable: "--font-sora",
    display: "swap",
});

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
            <body
                className={`${inter.variable} ${sora.variable} bg-[var(--bg)] text-[var(--text)] antialiased`}
            >
                <ThemeProvider>
                    <div className="flex min-h-dvh flex-col">
                        <Header />
                        <div className="flex-1">{children}</div>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
