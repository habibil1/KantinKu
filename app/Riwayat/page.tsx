"use client";
import { useEffect, useState } from "react";
import { rupiah } from "@/data/menu";

export default function HalamanRiwayat() {
  const [riwayat, setRiwayat] = useState<any[]>([]);

  useEffect(() => {
    // Menarik data riwayat dari localStorage saat halaman dimuat
    const data = JSON.parse(localStorage.getItem("riwayat") ?? "[]");
    setRiwayat(data);
  }, []);

  if (riwayat.length === 0) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Riwayat Pesanan</h1>
        <p className="text-slate-500 text-lg">Belum ada riwayat pesanan.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Riwayat Pesanan</h1>
      <div className="space-y-4">
        {riwayat.map((pesanan, i) => (
          <div key={i} className="rounded-xl border bg-white p-6 shadow-sm">
            {/* Header Riwayat */}
            <div className="border-b pb-3 mb-3 flex flex-wrap justify-between items-center gap-2">
              <span className="text-sm font-medium text-slate-500">
                {pesanan.waktu}
              </span>
              <span className="font-bold text-orange-600 text-lg">
                {rupiah(pesanan.total)}
              </span>
            </div>

            {/* Info Pemesan */}
            <div className="mb-4">
              <p className="font-semibold text-lg">
                {pesanan.nama}{" "}
                {pesanan.kelas && (
                  <span className="text-slate-500 text-base font-normal">
                    {" "}
                    - {pesanan.kelas}
                  </span>
                )}
              </p>
              <p className="text-sm font-medium rounded inline-block bg-slate-100 px-2 py-1 mt-1 text-slate-700">
                {pesanan.caraAmbil === "diantar"
                  ? "🛵 Diantar ke kelas"
                  : "🚶‍♂️ Ambil sendiri"}
              </p>
            </div>

            {/* Daftar Item Menu */}
            <ul className="text-sm space-y-2 mb-4">
              {pesanan.items.map((item: any, idx: number) => (
                <li
                  key={idx}
                  className="flex justify-between items-center border-b border-slate-100 pb-1"
                >
                  <span>
                    {item.namaItem}{" "}
                    <span className="font-semibold text-slate-700">
                      x{item.jumlah}
                    </span>
                  </span>
                  <span className="text-slate-600">
                    {rupiah(item.subTotalItem)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Rincian Harga Akhir */}
            <div className="text-xs text-slate-500 flex justify-between mt-2 pt-2 border-t border-slate-100">
              <div className="space-y-1">
                <p>Subtotal: {rupiah(pesanan.subtotal)}</p>
                {pesanan.diskon > 0 && (
                  <p className="text-green-600">
                    Diskon: -{rupiah(pesanan.diskon)}
                  </p>
                )}
                <p>Ongkir: {rupiah(pesanan.ongkir)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
