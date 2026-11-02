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
  metadataBase: new URL("https://visiondx.vercel.app"),
  title: "VisionDX | Retinal Image Research Tool",
  description:
    "Explore an AI-assisted retinal image classification workflow with VisionDX, an educational research prototype.",
  applicationName: "VisionDX",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "VisionDX | Retinal Image Research Tool",
    description:
      "An educational prototype for exploring retinal image classification.",
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 1280,
        height: 1280,
        alt: "VisionDX eye logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "VisionDX | Retinal Image Research Tool",
    description:
      "An educational prototype for exploring retinal image classification.",
    images: ["/icon.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-gl-theme="light"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
