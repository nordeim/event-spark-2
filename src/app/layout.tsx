import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Event Spark - Your event platform template",
  description:
    "The event platform where ideas become experiences. Build branded registration pages, track attendees, and grow your community. No code required.",
  keywords: [
    "events",
    "event platform",
    "registration",
    "attendees",
    "eventspark",
    "organizers",
  ],
  openGraph: {
    title: "Event Spark - Your event platform template",
    description:
      "The event platform where ideas become experiences. Build branded registration pages, track attendees, and grow your community.",
    type: "website",
    siteName: "eventspark",
  },
  twitter: {
    card: "summary",
    title: "Event Spark - Your event platform template",
    description:
      "The event platform where ideas become experiences. Build branded registration pages, track attendees, and grow your community.",
  },
  icons: {
    icon: "/logo-glyph.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#e4447c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body
        className={`${bricolage.variable} ${dmSans.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
