import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KingShadP // Archive",
  description: "The Sovereign System Archive of KingShadP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased bg-[#090908] text-[#dcc57b] overflow-x-hidden selection:bg-[#dcc57b] selection:text-[#090908]">
        {children}
      </body>
    </html>
  );
}
