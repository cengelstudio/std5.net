import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Metadata } from "next";
import type { Viewport } from 'next'


export const viewport: Viewport = {
  themeColor: "#430086",
}

export const metadata: Metadata = {
  title: "STD5 - Post Prodüksiyon",
  description: "Ekranların arkasındaki yaratıcı güç",
  openGraph: {
    title: "STD5 - Post Prodüksiyon",
    description: "Ekranların arkasındaki yaratıcı güç",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 1200,
        alt: "STD5 - Post Prodüksiyon",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "STD5 - Post Prodüksiyon",
    description: "Ekranların arkasındaki yaratıcı güç",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <meta name="robots" content="index, follow" />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
