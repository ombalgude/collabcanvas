import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";


// ✅ Load local fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

// ✅ SEO metadata
export const metadata: Metadata = {
  title: "Excelidraw",
  description: "Collaborative whiteboard tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* 🚫 No favicon included here */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
       
        {children}
      </body>
    </html>
  );
}
