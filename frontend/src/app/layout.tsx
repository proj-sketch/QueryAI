import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QueryAI — Business Intelligence Dashboard",
  description: "Conversational AI for Instant Business Intelligence Dashboards. Ask questions in plain English, get interactive charts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
