import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PathWallet",
  description:
    "PathWallet is a modern expense tracker that helps you manage your spending, set financial goals, and monitor your progress with ease.",
  keywords: [
    "PathWallet",
    "expense tracker",
    "budget app",
    "personal finance",
    "money management",
    "financial goals",
    "track spending",
  ],
  authors: [{ name: "Mr Makaveli" }],
  icons: {
    icon: "/Vector.png",
    shortcut: "/Vector.png",
    apple: "/Vector.png",
  },
  openGraph: {
    title: "PathWallet – Smart Expense Tracking & Goal Setting",
    description:
      "Take control of your finances with PathWallet. Track expenses, create budgets, set goals, and watch your financial progress in real-time.",
    url: "https://pathwallet.app", // your hosted domain
    siteName: "PathWallet",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
