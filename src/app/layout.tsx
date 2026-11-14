import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Dancing_Script } from "next/font/google";
import "./globals.css";

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

const dancingScript = Dancing_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "700",
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
    title: "AxeVin",
    description: "Portfolio of Vinit Singh — building high-performance web applications and interactive 3D digital experiences.",
    creator: "@AxeVinSi",
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
      className={`${inter.variable} ${jetbrainsMono.variable} ${dancingScript.variable} h-full antialiased dark`}
    >
      {/*
        Disable the browser's native scroll restoration so that refreshing
        always starts at the very top of the page, not mid-page at Contact.
      */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `history.scrollRestoration = 'manual'; window.scrollTo(0, 0);`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#0A0A0A] text-[#EDEDED] antialiased font-[var(--font-inter)] selection:bg-white/20 selection:text-white">
        {children}
      </body>
    </html>
  );
}
