import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AxeVin",
  description: "Portfolio of Vinit Singh — a Full-Stack Software Developer specialising in high-performance web apps, interactive 3D interfaces, and premium user experiences.",
  keywords: ["Vinit Singh", "Software Developer", "Full Stack Engineer", "React", "Next.js", "Portfolio"],
  authors: [{ name: "Vinit Singh" }],
  openGraph: {
    title: "AxeVin",
    description: "Portfolio of Vinit Singh — building high-performance web applications and interactive 3D digital experiences.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "AveVin",
    description: "Portfolio of Vinit Singh — building high-performance web applications and interactive 3D digital experiences.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#fafafa] text-[#09090b] dark:bg-[#030712] dark:text-[#f4f4f5] transition-colors duration-500 font-[var(--font-inter)]">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
