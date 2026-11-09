"use client";

import { useState } from "react";
import MenuCard from "@/components/MenuCard";
import { menu } from "@/data/menu";

export default function MenuPage() {
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("Semua");
  const [urutan, setUrutan] = useState("Urutan awal");

  const filteredMenu = menu.filter((item) => {
    const matchSearch = item.nama
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchKategori =
      kategori === "Semua" || item.kategori === kategori;
    return matchSearch && matchKategori;
  });

  if (urutan === "Harga termurah") {
    filteredMenu.sort((a, b) => a.harga - b.harga);
  } else if (urutan === "Harga termahal") {
    filteredMenu.sort((a, b) => b.harga - a.harga);
  } else if (urutan === "Nama A-Z") {
    filteredMenu.sort((a, b) => a.nama.localeCompare(b.nama));
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-extrabold text-gray-900">Katalog Menu</h1>

      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Cari menu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2.5 rounded-lg w-full bg-white"
          suppressHydrationWarning
        />

        <select
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="border p-2.5 rounded-lg bg-white"
          suppressHydrationWarning
        >
          <option value="Semua">Semua</option>
          <option value="Makanan">Makanan</option>
          <option value="Minuman">Minuman</option>
          <option value="Camilan">Camilan</option>
        </select>

        <select
          value={urutan}
          onChange={(e) => setUrutan(e.target.value)}
          className="border p-2.5 rounded-lg bg-white"
          suppressHydrationWarning
        >
          <option value="Urutan awal">Urutan awal</option>
          <option value="Harga termurah">Harga termurah</option>
          <option value="Harga termahal">Harga termahal</option>
          <option value="Nama A-Z">Nama A-Z</option>
        </select>
      </div>

      {filteredMenu.length === 0 ? (
        <p className="text-center text-gray-500 py-12 text-lg font-medium">
          Menu tidak ditemukan.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenu.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
