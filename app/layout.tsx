import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "KantinKu",
  description: "Aplikasi pesan antar makanan untuk kantin sekolah",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased bg-gray-50 text-gray-900" suppressHydrationWarning>
        <Navbar />
        <main className="max-w-5xl mx-auto py-8 px-4">{children}</main>
      </body>
    </html>
  );
}
