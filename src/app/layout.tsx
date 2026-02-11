import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { SITE_URL, SITE_NAME } from "@/constants/site";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "An ancient Chinese divination system meets modern astronomy and blockchain. " +
  "Real-time hexagram readings from the I Ching tradition, backed by planetary data " +
  "and cryptographically anchored on Ethereum.";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — 梅花電腦`,
    template: `%s | ${SITE_NAME}`,
  },
  description,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: `${SITE_NAME} — 梅花電腦`,
    description,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — 梅花電腦`,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistMono.variable} font-mono antialiased`}>
        {children}
      </body>
    </html>
  );
}
