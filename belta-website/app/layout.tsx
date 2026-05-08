import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beltà Scarfs",
  description: "Lebanese boutique scarf house — handcrafted scarfs from Beirut.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className="h-full">
      <body suppressHydrationWarning className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
