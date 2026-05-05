import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import AuthContext from "@/components/AuthContext";
import TopNav from "@/components/layout/TopNav";
import Sidebar from "@/components/layout/Sidebar";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-on-background font-body">
        <AuthContext>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <TopNav />
              <main className="flex-1 pt-20 px-6 md:px-12 pb-12 overflow-y-auto">
                <div className="max-w-[1000px] mx-auto">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </AuthContext>
      </body>
    </html>
  );
}
