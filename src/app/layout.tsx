import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
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
    "Studentforge Platform — A legitimate educational training platform. Elevate your technical expertise with curated engineering resources, video lectures, and hands-on database training.",
  keywords: [
    "Studentforge",
    "Platform",
    "Engineering",
    "Full Stack",
    "Database",
    "Learning",
    "Lectures",
    "Resources",
    "Education",
    "Training",
    "Online Courses",
  ],
  authors: [{ name: "Redlix Pro Wing", url: "https://www.redlix.co.in" }],
  creator: "Redlix Pro Wing",
  publisher: "Student Forge",
  category: "education",
  classification: "Education / Online Learning",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://platform.studentforge.in"
  ),
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL || "https://platform.studentforge.in",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://platform.studentforge.in",
    title: "Studentforge Platform — Online Learning & Engineering Training",
    description:
      "A legitimate online educational platform for engineering students. Elevate your technical expertise with curated resources, video lectures, and hands-on database training.",
    siteName: "Studentforge Platform",
    images: [
      {
        url: "https://ik.imagekit.io/dypkhqxip/sf%20bannerwhne",
        width: 1200,
        height: 630,
        alt: "Studentforge Platform — Online Learning & Engineering Training",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Studentforge Platform — Online Learning & Engineering Training",
    description:
      "A legitimate online educational platform. Elevate your technical expertise with curated engineering resources and video lectures.",
    images: ["https://ik.imagekit.io/dypkhqxip/sf%20bannerwhne"],
  },
  icons: {
    icon: [
      { url: "https://ik.imagekit.io/dypkhqxip/temp_logo.png?updatedAt=1783580957397", type: "image/png", sizes: "any" },
    ],
    apple: [
      { url: "https://ik.imagekit.io/dypkhqxip/temp_logo.png?updatedAt=1783580957397", type: "image/png", sizes: "180x180" },
    ],
    shortcut: "https://ik.imagekit.io/dypkhqxip/temp_logo.png?updatedAt=1783580957397",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
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
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href="https://ik.imagekit.io/dypkhqxip/temp_logo.png?updatedAt=1783580957397" type="image/png" />
        <link rel="apple-touch-icon" sizes="180x180" href="https://ik.imagekit.io/dypkhqxip/temp_logo.png?updatedAt=1783580957397" />
        <link rel="shortcut icon" href="https://ik.imagekit.io/dypkhqxip/temp_logo.png?updatedAt=1783580957397" />

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />

        <meta name="theme-color" content="#1d4ed8" />
        <meta name="msapplication-TileColor" content="#1d4ed8" />

        <meta name="rating" content="general" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="application-name" content="Studentforge Platform" />
        <meta name="generator" content="Next.js" />
        <meta httpEquiv="content-type" content="text/html; charset=utf-8" />
        <meta httpEquiv="x-ua-compatible" content="IE=edge" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <Toaster position="top-center" richColors />
        {children}
      </body>
    </html>
  );
}
