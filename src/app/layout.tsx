import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Studentforge Platform",
    template: "%s | Studentforge Platform",
  },
  description:
    "Studentforge Platform — Elevate your technical expertise with curated engineering resources, video lectures, and hands-on database training.",
  keywords: [
    "Studentforge",
    "Platform",
    "Engineering",
    "Full Stack",
    "Database",
    "Learning",
    "Lectures",
    "Resources",
  ],
  authors: [{ name: "Studentforge Team" }],
  creator: "Studentforge Team",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    title: "Studentforge Platform",
    description:
      "Elevate your technical expertise with curated engineering resources, video lectures, and hands-on database training.",
    siteName: "Studentforge Platform",
    images: [
      {
        url: "https://ik.imagekit.io/dypkhqxip/urlimag",
        width: 1200,
        height: 630,
        alt: "Studentforge Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Studentforge Platform",
    description:
      "Elevate your technical expertise with curated engineering resources and video lectures.",
    images: ["https://ik.imagekit.io/dypkhqxip/urlimag"],
  },
  icons: {
    icon: [
      { url: "https://ik.imagekit.io/dypkhqxip/temp_logo.png?updatedAt=1783580957397", type: "image/png" },
    ],
    apple: [
      { url: "https://ik.imagekit.io/dypkhqxip/temp_logo.png?updatedAt=1783580957397", type: "image/png" },
    ],
    shortcut: "https://ik.imagekit.io/dypkhqxip/temp_logo.png?updatedAt=1783580957397",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        
        <link rel="icon" href="https://ik.imagekit.io/dypkhqxip/temp_logo.png?updatedAt=1783580957397" type="image/png" />
        <link rel="apple-touch-icon" href="https://ik.imagekit.io/dypkhqxip/temp_logo.png?updatedAt=1783580957397" />
        <link rel="shortcut icon" href="https://ik.imagekit.io/dypkhqxip/temp_logo.png?updatedAt=1783580957397" />

        
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />

        
        <meta name="theme-color" content="#1d4ed8" />
        <meta name="msapplication-TileColor" content="#1d4ed8" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
