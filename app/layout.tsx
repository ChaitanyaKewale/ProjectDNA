import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import ExtensionErrorFilter from "@/components/ui/ExtensionErrorFilter";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ProjectDNA — Build Dream Teams with AI",
  description:
    "ProjectDNA uses AI to analyze your project, build its DNA profile, and match you with the perfect developers based on skills, working style, and availability.",
  keywords: ["project collaboration", "developer matching", "team building", "AI", "open source"],
  openGraph: {
    title: "ProjectDNA — Build Dream Teams with AI",
    description: "AI-powered developer collaboration and team matching platform.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body suppressHydrationWarning>
        <ExtensionErrorFilter />
        <ClerkProvider>
          <Navbar />
          <main style={{ paddingTop: "68px", minHeight: "100vh" }}>
            {children}
          </main>
        </ClerkProvider>
      </body>
    </html>
  );
}