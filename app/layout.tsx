import type { Metadata } from "next";
import "./globals.css";
import { Cormorant_Garamond, Manrope, Space_Mono } from "next/font/google";
import { clsx } from "clsx";
import Script from "next/script";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-display", weight: ["400", "500", "600", "700"] });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-body", weight: ["400", "500", "600", "700"] });
const spaceMono = Space_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "WedSaaS - Wedding Invitations Platform",
  description: "Build, share, and manage beautiful digital wedding invitations at scale.",
  openGraph: {
    title: "WedSaaS",
    description: "Build, share, and manage beautiful digital wedding invitations at scale.",
    url: "http://localhost:3000",
    siteName: "WedSaaS",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={clsx(cormorant.variable, manrope.variable, spaceMono.variable)} suppressHydrationWarning>
      <body className="min-h-screen" suppressHydrationWarning>
        {children}
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ? (
          <Script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        ) : null}
        {process.env.NEXT_PUBLIC_GA4_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID}');`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
