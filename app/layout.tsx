import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "./components/ThemeProvider";
import DarkModeToggle from "./components/DarkModeToggle";
import { Analyze } from "./components/analytics/Analyze";
import "./globals.css";
import Script from "next/script";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://claudebuilder.club"),
  title: "ASU Claude Builder Club",
  description: "ASU Claude Builder Club - Building with Claude AI",
  openGraph: {
    type: "website",
    siteName: "ASU Claude Builder Club",
    url: "https://claudebuilder.club",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head></head>
      <body
        suppressHydrationWarning
        className={`${poppins.variable} antialiased absolute top-0 left-0 w-full h-[100dvh] overflow-auto`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <DarkModeToggle />
          <Analytics />
          <SpeedInsights />
          <Analyze />
        </ThemeProvider>
        <Script
          src="https://asucbc-umami.vercel.app/script.js"
          data-website-id={
            process.env.NEXT_PUBLIC_LOCAL_UMAMI_OVERRIDE_ID ||
            "407772a6-dc54-4c85-8e46-327d20c45c26"
          }
          data-auto-track="false"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
