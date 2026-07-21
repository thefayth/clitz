import type { Metadata } from "next";
import { Cormorant_Garamond, IBM_Plex_Mono, Manrope } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://subdesk-control-room.indigo-iris-5804.chatgpt.site"),
  title: "Subdesk — Creator Control Room",
  description:
    "A women-created control room that turns scattered creator work into GPT‑5.6-assisted drafts, human approvals, exports, and provenance receipts.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Subdesk — Creator Control Room",
    description: "AI that advises. Humans who decide. Creative work with receipts.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Subdesk Creator Control Room" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Subdesk — Creator Control Room",
    description: "AI that advises. Humans who decide. Creative work with receipts.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} ${mono.variable}`}>
        <a className="skip-link" href="#main-content">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
