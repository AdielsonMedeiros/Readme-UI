import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageProvider } from "../contexts/LanguageContext";
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
  metadataBase: new URL('https://readme-ui-pi.vercel.app'), // Base URL for relative images
  title: {
    default: "Readme-UI - Dynamic GitHub README Widgets",
    template: "%s | Readme-UI"
  },
  description: "Supercharge your GitHub Profile with dynamic, real-time widgets. Add Spotify, WakaTime, LeetCode stats, and more to your README in seconds.",
  keywords: ["github", "readme", "widgets", "profile", "generator", "spotify", "wakatime", "leetcode", "dynamic"],
  authors: [{ name: "Adielson Medeiros", url: "https://github.com/AdielsonMedeiros" }],
  creator: "Adielson Medeiros",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://readme-ui-pi.vercel.app", // Actual Production URL
    title: "Readme-UI - Dynamic GitHub README Widgets",
    description: "Create stunning, dynamic widgets for your GitHub profile. Spotify playing, WakaTime stats, and more.",
    siteName: "Readme-UI",
    images: [
      {
        url: "/og-image.png", // We should create this or use a generic one
        width: 1200,
        height: 630,
        alt: "Readme-UI Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Readme-UI - Dynamic GitHub README Widgets",
    description: "Make your GitHub Profile standout with dynamic animated widgets.",
    creator: "@AdielsonMedeiros", // Placeholder if valid
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
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
