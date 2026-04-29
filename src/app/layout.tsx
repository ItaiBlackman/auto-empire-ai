import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoEmpire AI | Build Your AI Empire in 60 Seconds",
  description: "The world's first platform to launch fully automated AI businesses. Pick a niche, enter a prompt, and watch your empire grow.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
