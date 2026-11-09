"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { href: "/", teks: "Beranda" },
  { href: "/menu", teks: "Menu" },
  { href: "/favorit", teks: "Favorit" },
  { href: "/keranjang", teks: "Keranjang" },
  { href: "/riwayat", teks: "Riwayat" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-6 border-b bg-white px-6 py-3">
      <span className="text-lg font-bold text-green-600">KantinKu</span>
      {menuItems.map((m) => {
        const isActive = pathname.toLowerCase() === m.href.toLowerCase();
        return (
          <Link
            key={m.href}
            href={m.href}
            className={
              isActive
                ? "font-semibold text-green-600"
                : "text-slate-600   hover:text-green-600"
            }
          >
            {m.teks}
          </Link>
        );
      })}
    </nav>
  );
}
