import { metadata } from "./metadata";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export { metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
