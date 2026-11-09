"use client";

import { useState, use } from "react";
import { notFound } from "next/navigation";
import { menuKantin } from "@/data/menu";

export default function DetailMenu({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const menu = menuKantin.find((m) => m.id === Number(id));

  const [jumlah, setJumlah] = useState(1);
  const [pesan, setPesan] = useState("");

  if (!menu) {
    notFound();
    return null;
  }

  const totalHarga = menu.harga * jumlah;

  const handleTambahKeKeranjang = () => {
    if (jumlah < 1) {
      setPesan("Gagal: Jumlah minimal 1.");
      return;
    }

    const keranjangLama = localStorage.getItem("keranjang");
    const keranjang = keranjangLama ? JSON.parse(keranjangLama) : [];

    const indexMenu = keranjang.findIndex(
      (item: { id: number; jumlah: number }) => item.id === menu.id,
    );
    let jumlahSudahAda = 0;

    if (indexMenu !== -1) {
      jumlahSudahAda = keranjang[indexMenu].jumlah;
    }

    if (jumlah + jumlahSudahAda > menu.stok) {
      setPesan(
        `Gagal: Stok tidak cukup. Kamu sudah memasukkan ${jumlahSudahAda} porsi ke keranjang sebelumnya.`,
      );
      return;
    }

    if (indexMenu !== -1) {
      keranjang[indexMenu].jumlah += jumlah;
    } else {
      keranjang.push({ id: menu.id, jumlah: jumlah });
    }

    localStorage.setItem("keranjang", JSON.stringify(keranjang));

    window.dispatchEvent(new Event("keranjang-berubah"));

    setPesan("Ditambahkan ke keranjang.");
  };

  return (
    <div className="max-w-xl mx-auto border rounded-xl p-6 bg-white mt-10 shadow-sm">
      <h1 className="text-3xl font-bold mb-2">{menu.nama}</h1>
      <p className="text-gray-500 mb-4">{menu.kategori}</p>

      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg mb-6">
        <span className="text-2xl font-bold text-blue-600">
          Rp {menu.harga.toLocaleString("id-ID")}
        </span>
        <span
          className={`font-semibold ${
            menu.stok === 0 ? "text-red-500" : "text-green-600"
          }`}
        >
          {menu.stok === 0 ? "Habis" : `Sisa Stok: ${menu.stok}`}
        </span>
      </div>

      <div className="border-t pt-6 mt-4">
        {menu.stok === 0 ? (
          <p className="text-red-500 font-bold text-lg text-center bg-red-50 p-3 rounded-lg">
            Menu ini habis.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <label htmlFor="jumlah" className="font-medium text-lg">
                Jumlah:
              </label>
              <input
                type="number"
                id="jumlah"
                min="1"
                max={menu.stok}
                value={jumlah}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setJumlah(isNaN(val) ? 0 : val);
                }}
                className="border p-2 rounded-lg w-24 text-center text-lg"
              />
            </div>

            <div className="text-xl font-semibold mb-2">
              Total Harga: Rp {totalHarga.toLocaleString("id-ID")}
            </div>

            <button
              onClick={handleTambahKeKeranjang}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 font-bold w-full transition"
            >
              Tambah ke keranjang
            </button>

            {pesan && (
              <p
                className={`font-medium p-3 rounded-lg text-center ${
                  pesan.includes("Gagal")
                    ? "bg-red-50 text-red-600"
                    : "bg-green-50 text-green-600"
                }`}
              >
                {pesan}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
