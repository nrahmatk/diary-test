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
  title: "Wisata Diary - Discover Amazing Travel Stories",
  description:
    "Explore and share amazing travel experiences from around Indonesia. Discover hidden gems, travel tips, and inspiring journey stories.",
  keywords: [
    "wisata",
    "travel",
    "diary",
    "indonesia",
    "tourism",
    "adventure",
    "vacation",
  ],
  authors: [{ name: "Wisata Diary" }],
  creator: "Wisata Diary",
  publisher: "Wisata Diary",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || ""),
  openGraph: {
    title: "Wisata Diary - Discover Amazing Travel Stories",
    description:
      "Explore and share amazing travel experiences from around Indonesia",
    url: new URL(process.env.NEXT_PUBLIC_APP_URL || ""),
    siteName: "Wisata Diary",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Wisata Diary - Travel Stories",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wisata Diary - Discover Amazing Travel Stories",
    description:
      "Explore and share amazing travel experiences from around Indonesia",
    images: ["/pwa-icon.webp"],
    creator: "@wisatadiary",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#059669" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Wisata Diary" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
