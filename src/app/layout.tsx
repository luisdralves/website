import type { Metadata } from "next";
import { Courier_Prime, Outfit, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { MotionProvider } from "@/components/motion-provider";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const courierPrime = Courier_Prime({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = "https://luisdralves.dev";
const SITE_TITLE = "luisdralves";
const SITE_DESCRIPTION =
  "Personal site of Luís Alves. Building systems that connect, things to preserve, new ways to see familiar things. Easier to show than tell.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_TITLE,
    type: "website",
    locale: "en",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Luís Alves",
  alternateName: "luisdralves",
  url: SITE_URL,
  sameAs: [
    "https://github.com/luisdralves",
    "https://gitea.luisdralves.dev/luis",
    "https://linkedin.com/in/luisdralves",
  ],
  jobTitle: "Software Engineer",
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${outfit.variable} ${courierPrime.variable} font-body antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-200 focus:rounded focus:bg-accent-cyan focus:px-4 focus:py-2 focus:font-mono focus:text-background focus:text-sm focus:no-underline"
        >
          Skip to content
        </a>
        <noscript>
          <style>{`
            [style*="opacity: 0"], [style*="opacity:0"] { opacity: 1 !important; }
            [style*="translate"], [style*="scale("], [style*="rotate("] { transform: none !important; }
            [style*="inset("] { clip-path: none !important; }
            [style*="blur("] { filter: none !important; }
            [style*="stroke-dashoffset"] { stroke-dashoffset: 0 !important; }
            [data-scroll-animated] {
              opacity: 1 !important;
              stroke-dashoffset: 0 !important;
              transform: none !important;
              clip-path: none !important;
              filter: none !important;
            }
            [data-noscript-hide] { display: none !important; }
            [data-projects-stage] { height: auto !important; }
            [data-projects-stage] > div {
              position: static !important;
              height: auto !important;
              overflow: visible !important;
            }
            [data-project-layer] {
              position: relative !important;
              inset: auto !important;
              pointer-events: auto !important;
              padding: 4rem 0;
              margin-bottom: 4rem;
            }
          `}</style>
        </noscript>
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: required for JSON-LD schema markup
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
