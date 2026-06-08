import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Live Docs",
  description: "Your go-to collaborative workspace for seamless documentation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`h-full antialiased`}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
