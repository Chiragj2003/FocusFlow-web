import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/lib/theme";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FocusFlow - Smart Habit Tracker",
  description: "Build lasting habits with FocusFlow. Track daily progress, visualize streaks, gain insights, and achieve your personal goals with our beautiful, intuitive habit tracking app.",
  keywords: ["habit tracker", "productivity", "goal tracking", "streaks", "daily habits", "self improvement", "personal development"],
  authors: [{ name: "FocusFlow Team" }],
  creator: "FocusFlow",
  publisher: "FocusFlow",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://focusflow.app",
    siteName: "FocusFlow",
    title: "FocusFlow - Smart Habit Tracker",
    description: "Build lasting habits with FocusFlow. Track daily progress, visualize streaks, and achieve your goals.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FocusFlow - Smart Habit Tracker",
    description: "Build lasting habits with FocusFlow. Track daily progress, visualize streaks, and achieve your goals.",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icon-512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAD8CC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
