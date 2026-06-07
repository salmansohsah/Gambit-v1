import type { Metadata } from "next";
import { Inter, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const arabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://gambit.com'),
  title: "GAMBIT - Strategic Digital Agency",
  description: "Create positions. Defend advantages. Scale intelligently.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "GAMBIT - Strategic Digital Agency",
    description: "Create positions. Defend advantages. Scale intelligently.",
    siteName: "GAMBIT",
  },
  twitter: {
    card: "summary_large_image",
    title: "GAMBIT - Strategic Digital Agency",
    description: "Create positions. Defend advantages. Scale intelligently.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${arabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
