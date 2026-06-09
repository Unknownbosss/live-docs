import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/ui/themes";
import Provider from "./Provider";

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
    <ClerkProvider
      appearance={{
        theme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning className={`h-full antialiased`}>
        <body className="min-h-screen font-sans antialiased">
          <Provider>{children}</Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
