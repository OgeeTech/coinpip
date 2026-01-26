import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Suspense } from "react"; // Added this

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coinpip", // Fixed the typo here too!
  description: "crypto screener app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Wrapping Header in Suspense is required because it uses useSearchParams().
           This prevents the 'CSR bailout' error during Netlify builds.
        */}
        <Suspense fallback={<div className="h-20 bg-dark-400 border-b border-dark-300" />}>
          <Header />
        </Suspense>

        {children}
      </body>
    </html>
  );
}