"use client";

import { useState } from "react";
import MenuCard from "@/components/MenuCard";
import { Menu } from "@/data/menu";

export default function MenuPage() {
  const [search, setSearch] = useState("");
  const [urutan, setUrutan] = useState("awal");
  const [kategori, setKategori] = useState("Semua");

  const filteredMenu = Menu.filter((item) => {
    const matchSearch = item.nama.toLowerCase().includes(search.toLowerCase());
    const matchKategori = kategori === "Semua" || item.kategori === kategori;
    return matchSearch && matchKategori;
  });

  if (urutan === "termurah") {
    filteredMenu.sort((a, b) => a.harga - b.harga);
  } else if (urutan === "termahal") {
    filteredMenu.sort((a, b) => b.harga - a.harga);
  } else if (urutan === "az" || urutan === "a-z") {
    filteredMenu.sort((a, b) => a.nama.localeCompare(b.nama));
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Katalog Menu</h1>

      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Cari menu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <select
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="Semua">Semua</option>
          <option value="Makanan">Makanan</option>
          <option value="Minuman">Minuman</option>
        </select>

        <select
          value={urutan}
          onChange={(e) => setUrutan(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="awal">Urutan awal</option>
          <option value="termurah">Harga termurah</option>
          <option value="termahal">Harga termahal</option>
          <option value="az">Nama A-Z</option>
        </select>
      </div>

      {filteredMenu.length === 0 ? (
        <p className="text-center text-gray-500 py-10">Menu tidak ditemukan.</p>
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
