"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const menu = [
  { href: "/", teks: "Beranda" },
  { href: "/menu", teks: "Menu" },
  { href: "/favorit", teks: "Favorit" },
  { href: "/keranjang", teks: "Keranjang" },
  { href: "/riwayat", teks: "Riwayat" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [jumlahKeranjang, setJumlahKeranjang] = useState(0);

  useEffect(() => {
    // Fungsi untuk menghitung total barang dari localStorage
    function hitung() {
      const data = JSON.parse(localStorage.getItem("keranjang") ?? "[]");
      const total = data.reduce((acc: number, cur: any) => acc + cur.jumlah, 0);
      setJumlahKeranjang(total);
    }

    // Hitung saat komponen pertama kali dimuat
    hitung();

    // Dengarkan kabar perubahan dari halaman lain (Poin 15)
    window.addEventListener("keranjang-berubah", hitung);

    // Bersihkan saat komponen dilepas
    return () => window.removeEventListener("keranjang-berubah", hitung);
  }, []);

  return (
    <nav className="flex items-center gap-6 border-b bg-white px-6 py-3 shadow-sm">
      <span className="text-lg font-bold text-orange-600">KantinKu</span>
      {menu.map((m) => (
        <Link
          key={m.href}
          href={m.href}
          className={
            pathname === m.href
              ? "font-semibold text-orange-600 border-b-2 border-orange-600 pb-1"
              : "text-slate-600 hover:text-orange-600 pb-1"
          }
        >
          {/* Tampilkan badge angka khusus untuk menu keranjang jika jumlahnya > 0 */}
          {m.teks}{" "}
          {m.href === "/keranjang" &&
            jumlahKeranjang > 0 &&
            `(${jumlahKeranjang})`}
        </Link>
      ))}
    </nav>
  );
}
