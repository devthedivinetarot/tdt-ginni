import type { Metadata, Viewport } from "next";
import Script from 'next/script';
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import ClientLayout from "./client-layout";
import ErrorBoundary from "@/components/system/ErrorBoundary";
import FooterJsonLd from "@/components/layout/FooterJsonLd";
import "./globals.css";
import { headers } from 'next/headers';

function getNonce(): string | undefined {
  try {
    const nonce = headers().get('x-next-nonce');
    return nonce || undefined;
  } catch {
    return undefined;
  }
}

export const metadata: Metadata = {
  title: "The Divine Tarot | Premium Tarot Readings",
  description: "Get answers from the universe in seconds. Experience mystical, emotionally intelligent tarot readings.",
  keywords: "tarot, tarot reading, spiritual guidance, fortune telling, psychic reading",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = getNonce();

  return (
    <html lang="en">
      <head />
      <body
        className="antialiased bg-[rgb(var(--background))] text-[rgb(var(--foreground))]"
        suppressHydrationWarning
      >
        {/*
         * JSON-LD structured data — rendered server-side, safe under CSP.
         * GA4 / GTM / Clarity scripts — loaded via Next.js <Script> at
         * document body level, external source whitelisted in CSP.
         */}
        <FooterJsonLd />
        <GoogleAnalytics
          gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
          gtmId={process.env.NEXT_PUBLIC_GTM_ID}
        />
        <Script
          id="clarity-analytics"
          src="https://cdn.clarity.ms/script/0.0.0/script.js"
          strategy="afterInteractive"
          nonce={nonce}
        />
        <ErrorBoundary>
          <ClientLayout>{children}</ClientLayout>
        </ErrorBoundary>
      </body>
    </html>
  );
}


