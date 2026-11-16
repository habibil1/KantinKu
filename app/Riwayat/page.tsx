"use client";
import { useEffect, useState } from "react";
import { rupiah } from "@/data/menu";

type RiwayatItem = {
  namaItem: string;
  jumlah: number;
  subTotalItem: number;
};

type RiwayatPesanan = {
  nama: string;
  waktu: string;
  total: number;
  items: RiwayatItem[];
};

export default function HalamanRiwayat() {
  const [riwayat, setRiwayat] = useState<RiwayatPesanan[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const data = JSON.parse(localStorage.getItem("riwayat") ?? "[]");
      setRiwayat(data);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (riwayat.length === 0) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Riwayat Pesanan</h1>
        <p className="text-slate-500 text-lg">Belum ada pesanan.</p>
      </div>
    );
  }

  const totalSemua = riwayat.reduce((acc, cur) => acc + cur.total, 0);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold mb-2 text-gray-900">Riwayat Pesanan</h1>
      <div className="mb-6 rounded-xl bg-blue-50 p-4 border border-blue-200">
        <p className="font-semibold text-blue-900">
          Ringkasan: {riwayat.length} pesanan, total belanja{" "}
          {rupiah(totalSemua)}
        </p>
      </div>

      <div className="space-y-4">
        {riwayat.map((pesanan, i) => (
          <div key={i} className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="border-b pb-3 mb-3 flex flex-wrap justify-between items-center gap-2">
              <span className="text-sm font-medium text-slate-500">
                {pesanan.waktu}
              </span>
              <span className="font-bold text-blue-600 text-lg">
                {rupiah(pesanan.total)}
              </span>
            </div>

            <div className="mb-4">
              <p className="font-semibold text-lg text-gray-900">{pesanan.nama}</p>
            </div>

            <ul className="text-sm space-y-2 mb-4">
              {pesanan.items.map((item, idx) => (
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
          </div>
        ))}
      </div>
    </div>
  );
}
