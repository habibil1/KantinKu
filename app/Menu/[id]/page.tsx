"use client";
import { useState, use, useEffect } from "react";
import { menu, rupiah } from "@/data/menu";
import { notFound } from "next/navigation";
import Link from "next/link";

type ItemKeranjang = {
  id: number;
  jumlah: number;
};

export default function DetailMenu({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const menuId = Number(id);
  const item = menu.find((m) => m.id === menuId);

  if (!item) {
    notFound();
  }

  // --- State Favorit (Poin 16) ---
  const [isFavorit, setIsFavorit] = useState(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorit") ?? "[]");
    setIsFavorit(favs.includes(menuId));
  }, [menuId]);

  function toggleFavorit() {
    const favs: number[] = JSON.parse(localStorage.getItem("favorit") ?? "[]");
    let favsBaru;
    if (favs.includes(menuId)) {
      favsBaru = favs.filter((id) => id !== menuId);
    } else {
      favsBaru = [...favs, menuId];
    }
    localStorage.setItem("favorit", JSON.stringify(favsBaru));
    setIsFavorit(!isFavorit);
  }

  // --- State Keranjang ---
  const [jumlah, setJumlah] = useState(1);
  const [pesan, setPesan] = useState("");
  const [berhasil, setBerhasil] = useState(false);

  const keranjang: ItemKeranjang[] = JSON.parse(
    typeof window !== "undefined"
      ? (localStorage.getItem("keranjang") ?? "[]")
      : "[]",
  );

  const existing = keranjang.find((k) => k.id === item.id);
  const jumlahDiKeranjang = existing ? existing.jumlah : 0;
  const sisaStok = item.stok - jumlahDiKeranjang;

  function tambahKeKeranjang(e: React.FormEvent) {
    e.preventDefault();
    if (!item) return;
    setBerhasil(false);

    if (jumlah < 1) {
      return setPesan("Jumlah minimal 1.");
    }
    if (jumlah > sisaStok) {
      return setPesan(`Stok tidak cukup. Sisa stok tersedia: ${sisaStok}.`);
    }

    setPesan("");

    // Update keranjang di localStorage
    const index = keranjang.findIndex((k) => k.id === item.id);
    const keranjangBaru =
      index !== -1
        ? keranjang.map((k, i) =>
            i === index ? { ...k, jumlah: k.jumlah + jumlah } : k,
          )
        : [...keranjang, { id: item.id, jumlah }];

    localStorage.setItem("keranjang", JSON.stringify(keranjangBaru));
    setBerhasil(true);

    // Memberitahu navbar bahwa keranjang berubah (Poin 15)
    window.dispatchEvent(new Event("keranjang-berubah"));
  }

  return (
    <div className="mx-auto max-w-xl rounded-xl border bg-white p-6 shadow-sm">
      <Link href="/menu" className="text-sm text-orange-600 hover:underline">
        &larr; Kembali ke Menu
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <span className="inline-block rounded bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
          {item.kategori}
        </span>
      </div>

      <h1 className="mt-2 text-2xl font-bold">{item.nama}</h1>
      <p className="mt-2 text-xl font-semibold text-slate-900">
        {rupiah(item.harga)}
      </p>

      {/* Tombol Favorit (Poin 16) */}
      <button
        onClick={toggleFavorit}
        className="mt-3 rounded border border-orange-600 px-3 py-1 text-sm font-medium text-orange-600 hover:bg-orange-50 transition"
      >
        {isFavorit ? "♥ Favorit" : "♡ Tambah favorit"}
      </button>

      <p
        className={`mt-4 text-sm ${item.stok === 0 ? "text-red-600 font-semibold" : "text-green-700"}`}
      >
        {item.stok === 0
          ? "Stok habis"
          : `Stok total: ${item.stok} (Di keranjangmu: ${jumlahDiKeranjang})`}
      </p>

      {item.stok === 0 ? (
        <p className="mt-6 font-medium text-red-600">Menu ini habis.</p>
      ) : (
        <form
          onSubmit={tambahKeKeranjang}
          className="mt-6 space-y-4 border-t pt-4"
        >
          <h2 className="text-lg font-semibold">Pesan menu</h2>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Jumlah:</label>
            <input
              type="number"
              value={jumlah}
              onChange={(e) => setJumlah(Number(e.target.value))}
              className="block w-32 rounded border px-3 py-2 text-slate-800"
            />
          </div>
          <p className="font-medium">
            Total Subtotal:{" "}
            <span className="text-orange-600">
              {rupiah(item.harga * jumlah)}
            </span>
          </p>
          {pesan && <p className="text-sm text-red-600 font-medium">{pesan}</p>}
          {berhasil && (
            <p className="text-sm text-green-700 font-medium">
              Ditambahkan ke keranjang.
            </p>
          )}
          <button className="rounded bg-orange-600 px-4 py-2 text-white hover:bg-orange-700 transition">
            Tambah ke keranjang
          </button>
        </form>
      )}
    </div>
  );
}
