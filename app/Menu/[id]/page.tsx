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

  const [isFavorit, setIsFavorit] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const favs: number[] = JSON.parse(
        localStorage.getItem("favorit") ?? "[]",
      );
      setIsFavorit(favs.includes(menuId));
    }, 0);
    return () => clearTimeout(timer);
  }, [menuId]);

  function toggleFavorit() {
    const favs: number[] = JSON.parse(localStorage.getItem("favorit") ?? "[]");
    let favsBaru;
    if (favs.includes(menuId)) {
      favsBaru = favs.filter((i) => i !== menuId);
    } else {
      favsBaru = [...favs, menuId];
    }
    localStorage.setItem("favorit", JSON.stringify(favsBaru));
    setIsFavorit(!isFavorit);
  }

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

    const index = keranjang.findIndex((k) => k.id === item.id);
    const keranjangBaru =
      index !== -1
        ? keranjang.map((k, i) =>
            i === index ? { ...k, jumlah: k.jumlah + jumlah } : k,
          )
        : [...keranjang, { id: item.id, jumlah }];

    localStorage.setItem("keranjang", JSON.stringify(keranjangBaru));
    setBerhasil(true);

    window.dispatchEvent(new Event("keranjang-berubah"));
  }

  return (
    <div className="mx-auto max-w-xl rounded-xl border bg-white p-6 shadow-sm">
      <Link href="/menu" className="text-sm text-blue-600 hover:underline">
        &larr; Kembali ke Menu
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <span className="inline-block rounded bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
          {item.kategori}
        </span>
      </div>

      <h1 className="mt-2 text-2xl font-bold text-gray-900">{item.nama}</h1>
      <p className="mt-2 text-xl font-semibold text-blue-600">
        {rupiah(item.harga)}
      </p>

      <button
        onClick={toggleFavorit}
        className="mt-3 rounded border border-blue-600 px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 transition"
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
            <span className="text-blue-600 font-bold">
              {rupiah(item.harga * jumlah)}
            </span>
          </p>
          {pesan && <p className="text-sm text-red-600 font-medium">{pesan}</p>}
          {berhasil && (
            <p className="text-sm text-green-700 font-medium">
              Ditambahkan ke keranjang.
            </p>
          )}
          <button className="rounded bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition">
            Tambah ke keranjang
          </button>
        </form>
      )}
    </div>
  );
}
