"use client";
import { useEffect, useState } from "react";
import { type Menu } from "@/data/menu";
import KartuMenu from "@/components/MenuCard";

export default function HalamanFavorit() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [favIds, setFavIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data");
        return res.json();
      })
      .then((data) => {
        const favs = JSON.parse(localStorage.getItem("favorit") ?? "[]");
        setFavIds(favs);
        setMenus(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="py-12 text-center text-lg text-slate-500">Memuat...</div>
    );

  if (error)
    return (
      <div className="py-12 text-center text-lg text-red-500">
        Pesan galat: Gagal memuat data.
      </div>
    );

  const menuFavorit = menus.filter((m) => favIds.includes(m.id));

  if (menuFavorit.length === 0) {
    return (
      <div className="py-12 text-center text-lg text-slate-500">
        Belum ada menu favorit.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Menu Favorit</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {menuFavorit.map((item) => (
          <KartuMenu key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
