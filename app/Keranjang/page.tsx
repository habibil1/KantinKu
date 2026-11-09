"use client";
import { useEffect, useState } from "react";
import { menu, rupiah, type Menu } from "@/data/menu";
import Link from "next/link";

type ItemKeranjang = {
  id: number;
  jumlah: number;
};

export default function HalamanKeranjang() {
  const [keranjang, setKeranjang] = useState<ItemKeranjang[]>([]);
  const [menuList, setMenuList] = useState<Menu[]>([]);

  useEffect(() => {
    const data: ItemKeranjang[] = JSON.parse(
      localStorage.getItem("keranjang") ?? "[]",
    );
    setKeranjang(data);
    setMenuList(menu);
  }, []);

  function updateJumlah(id: number, delta: number) {
    const itemMenu = menuList.find((m) => m.id === id);
    if (!itemMenu) return;

    const updated = keranjang.map((k) => {
      if (k.id === id) {
        const barisBaru = k.jumlah + delta;
        if (barisBaru >= 1 && barisBaru <= itemMenu.stok) {
          return { ...k, jumlah: barisBaru };
        }
      }
      return k;
    });

    setKeranjang(updated);
    localStorage.setItem("keranjang", JSON.stringify(updated));
  }

  function hapusItem(id: number) {
    const updated = keranjang.filter((k) => k.id !== id);
    setKeranjang(updated);
    localStorage.setItem("keranjang", JSON.stringify(updated));
  }

  const daftarBelanja = keranjang
    .map((k) => {
      const item = menuList.find((m) => m.id === k.id);
      return { ...k, item };
    })
    .filter((k) => k.item !== undefined);

  const totalHargaSemua = daftarBelanja.reduce(
    (acc, cur) => acc + (cur.item?.harga ?? 0) * cur.jumlah,
    0,
  );

  if (daftarBelanja.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-500 text-lg">Keranjang masih kosong.</p>
        <Link
          href="/menu"
          className="mt-4 inline-block text-green-600 hover:underline font-medium"
        >
          Yuk pilih menu kantin &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold mb-4">Keranjang Belanja</h1>
      <ul className="divide-y divide-slate-200">
        {daftarBelanja.map(({ id, jumlah, item }) => (
          <li key={id} className="py-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{item?.nama}</h3>
              <p className="text-sm text-slate-500">
                {rupiah(item?.harga ?? 0)} per porsi
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded">
                <button
                  onClick={() => updateJumlah(id, -1)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  -
                </button>
                <span className="px-3 text-sm font-medium">{jumlah}</span>
                <button
                  onClick={() => updateJumlah(id, 1)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  +
                </button>
              </div>
              <span className="font-semibold w-24 text-right">
                {rupiah((item?.harga ?? 0) * jumlah)}
              </span>
              <button
                onClick={() => hapusItem(id)}
                className="text-sm text-red-600 hover:underline ml-2"
              >
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 border-t pt-4 flex items-center justify-between">
        <span className="text-lg font-bold">Total Pembayaran:</span>
        <span className="text-xl font-bold text-green-600">
          {rupiah(totalHargaSemua)}
        </span>
      </div>
    </div>
  );
}
