import "./globals.css";
import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://std5.net'),
  robots: {
    index: true,
    follow: true,
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return children;
}
