import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "KantinKu",
  description: "Aplikasi pesan antar makanan untuk kantin sekolah",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Navbar />
        <main className="pt-20 px-4">{children}</main>
      </body>
    </html>
  );
}
