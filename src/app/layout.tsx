import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import Script from "next/script";
import AuthContext from "@/components/AuthContext";
import ProgressProvider from "@/components/ProgressContext";
import TopNav from "@/components/layout/TopNav";
import Sidebar from "@/components/layout/Sidebar";
import { fetchSanity } from "@/lib/sanity";
import { sidebarHierarchyQuery } from "@/lib/sanity.queries";
import { prisma } from "@/lib/prisma";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ML Cognitive Coach",
  description: "A neo-brutalist learning experience for machine learning.",
};

import { Module } from "@/types";
import { getAllModules } from "@/lib/content-loader";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let sanityModules: Module[] = [];
  let progressData: any[] = [];

  try {
    sanityModules = await fetchSanity<Module[]>(sidebarHierarchyQuery);
  } catch (e) {
    console.error('Error fetching sanity structure:', e);
  }

  try {
    progressData = await prisma.progress.findMany();
  } catch (e) {
    console.warn('Database unreachable in layout, progress hidden:', e);
  }

  const localModules = getAllModules();
  // Only use local modules for now to remove demo content
  const modules = [...(localModules as any[])];

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body 
        className="min-h-full bg-[#F7F7FB] text-[#330C2F] font-body"
        suppressHydrationWarning
      >
        <Script src="https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js" strategy="beforeInteractive" />
        <AuthContext>
          <ProgressProvider modules={modules || []} progressData={progressData || []}>
            <div className="flex min-h-screen">
              <Sidebar modules={modules || []} progress={progressData || []} />
              <TopNav />
              <div className="flex-1 flex flex-col min-w-0 ml-[var(--sidebar-width)] transition-[margin] duration-300">
                <main className="flex-1 pt-20 pb-12 overflow-y-auto">
                  <div className="max-w-[1000px] mx-auto px-6 md:px-12">
                    {children}
                  </div>
                </main>
              </div>
            </div>
          </ProgressProvider>
        </AuthContext>
      </body>
    </html>
  );
}
