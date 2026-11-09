"use client";
import { useEffect, useState } from "react";
import { menu, rupiah, type Menu } from "@/data/menu";
import Link from "next/link";

type ItemKeranjang = { id: number; jumlah: number };
type ItemDetail = ItemKeranjang & { item: Menu };

export default function HalamanKeranjang() {
  const [keranjang, setKeranjang] = useState<ItemKeranjang[]>([]);
  const [menuList, setMenuList] = useState<Menu[]>([]);

  // State Promo & Checkout
  const [inputPromo, setInputPromo] = useState("");
  const [promoAktif, setPromoAktif] = useState(false);
  const [pesanPromo, setPesanPromo] = useState("");
  const [caraAmbil, setCaraAmbil] = useState("sendiri");
  const [nama, setNama] = useState("");
  const [kelas, setKelas] = useState("");
  const [pesanError, setPesanError] = useState("");
  const [struk, setStruk] = useState<any>(null); // Menyimpan data struk jika berhasil checkout

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("keranjang") ?? "[]");
    setKeranjang(data);
    setMenuList(menu);
  }, []);

  // Simpan keranjang dan picu event agar Navbar tahu (Poin 15)
  function simpanKeranjang(baru: ItemKeranjang[]) {
    setKeranjang(baru);
    localStorage.setItem("keranjang", JSON.stringify(baru));
    window.dispatchEvent(new Event("keranjang-berubah"));
  }

  function updateJumlah(id: number, delta: number) {
    const itemMenu = menuList.find((m) => m.id === id);
    if (!itemMenu) return;
    const updated = keranjang.map((k) => {
      if (k.id === id) {
        const barisBaru = k.jumlah + delta;
        if (barisBaru >= 1 && barisBaru <= itemMenu.stok)
          return { ...k, jumlah: barisBaru };
      }
      return k;
    });
    simpanKeranjang(updated);
  }

  function hapusItem(id: number) {
    simpanKeranjang(keranjang.filter((k) => k.id !== id));
  }

  const daftarBelanja: ItemDetail[] = keranjang
    .map((k) => ({ ...k, item: menuList.find((m) => m.id === k.id)! }))
    .filter((k) => k.item !== undefined);

  // Perhitungan Subtotal, Diskon, Ongkir, Total
  const subtotal = daftarBelanja.reduce(
    (acc, cur) => acc + cur.item.harga * cur.jumlah,
    0,
  );

  // Validasi Promo: otomatis batal jika subtotal turun di bawah 20.000
  const diskon =
    promoAktif && subtotal >= 20000 ? Math.round(subtotal * 0.1) : 0;
  const ongkir = caraAmbil === "diantar" ? 2000 : 0;
  const total = subtotal - diskon + ongkir;

  function cekPromo(e: React.FormEvent) {
    e.preventDefault();
    const kode = inputPromo.toUpperCase();
    if (kode === "HEMAT10") {
      if (subtotal >= 20000) {
        setPromoAktif(true);
        setPesanPromo("Promo HEMAT10 dipakai: diskon 10%.");
      } else {
        setPromoAktif(false);
        setPesanPromo("Promo HEMAT10 butuh belanja minimal Rp 20.000.");
      }
    } else {
      setPromoAktif(false);
      setPesanPromo("Kode promo tidak dikenal.");
    }
  }

  function prosesPesanan(e: React.FormEvent) {
    e.preventDefault();
    setPesanError("");
    if (nama.trim().length < 3) return setPesanError("Nama minimal 3 huruf.");
    if (caraAmbil === "diantar" && kelas.trim().length < 3)
      return setPesanError("Kelas minimal 3 karakter untuk pengantaran.");

    // Buat data struk
    const dataStruk = {
      nama,
      kelas,
      caraAmbil,
      subtotal,
      diskon,
      ongkir,
      total,
      items: daftarBelanja.map((k) => ({
        namaItem: k.item.nama,
        jumlah: k.jumlah,
        subTotalItem: k.item.harga * k.jumlah,
      })),
      waktu: new Date().toLocaleString("id-ID"),
    };

    // Simpan ke riwayat
    const riwayat = JSON.parse(localStorage.getItem("riwayat") ?? "[]");
    localStorage.setItem("riwayat", JSON.stringify([dataStruk, ...riwayat]));

    // Bersihkan keranjang dan reset form
    setStruk(dataStruk);
    simpanKeranjang([]);
    setInputPromo("");
    setPromoAktif(false);
    setNama("");
    setKelas("");
  }

  // Tampilan jika sudah checkout (Struk)
  if (struk) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-green-700 mb-4">
          Terima kasih, {struk.nama}!
        </h2>
        <div className="space-y-2 border-b pb-4 mb-4">
          {struk.items.map((it: any, i: number) => (
            <p key={i} className="flex justify-between">
              <span>
                {it.namaItem} x{it.jumlah}
              </span>
              <span>{rupiah(it.subTotalItem)}</span>
            </p>
          ))}
        </div>
        <div className="space-y-1 text-sm text-slate-700 font-medium border-b pb-4 mb-4">
          <p className="flex justify-between">
            <span>Subtotal:</span> <span>{rupiah(struk.subtotal)}</span>
          </p>
          {struk.diskon > 0 && (
            <p className="flex justify-between text-green-600">
              <span>Diskon:</span> <span>-{rupiah(struk.diskon)}</span>
            </p>
          )}
          <p className="flex justify-between">
            <span>
              Ongkir (
              {struk.caraAmbil === "diantar"
                ? `antar ke ${struk.kelas}`
                : "Diambil sendiri di kantin"}
              ):
            </span>
            <span>{rupiah(struk.ongkir)}</span>
          </p>
          <p className="flex justify-between text-lg font-bold text-orange-600 mt-2">
            <span>Total bayar:</span> <span>{rupiah(struk.total)}</span>
          </p>
        </div>
        <button
          onClick={() => setStruk(null)}
          className="w-full rounded bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
        >
          Kembali ke Keranjang
        </button>
      </div>
    );
  }

  if (daftarBelanja.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-500 text-lg">Keranjang masih kosong.</p>
        <Link
          href="/menu"
          className="mt-4 inline-block text-orange-600 hover:underline font-medium"
        >
          Yuk pilih menu kantin &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold mb-4">Keranjang Belanja</h1>

      {/* Daftar Item */}
      <ul className="divide-y divide-slate-200 mb-6 border-b pb-4">
        {daftarBelanja.map(({ id, jumlah, item }) => (
          <li key={id} className="py-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{item.nama}</h3>
              <p className="text-sm text-slate-500">
                {rupiah(item.harga)} per porsi
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
                {rupiah(item.harga * jumlah)}
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

      {/* Rincian Harga & Promo */}
      <div className="space-y-4 md:flex md:gap-8 md:space-y-0">
        <div className="flex-1 space-y-4">
          <form onSubmit={cekPromo} className="flex gap-2">
            <input
              value={inputPromo}
              onChange={(e) => setInputPromo(e.target.value)}
              placeholder="Kode promo"
              className="w-full rounded border px-3 py-1.5 uppercase"
            />
            <button className="rounded bg-slate-800 px-4 py-1.5 text-white hover:bg-slate-700">
              Pakai
            </button>
          </form>
          {pesanPromo && (
            <p
              className={`text-sm font-medium ${promoAktif && subtotal >= 20000 ? "text-green-600" : "text-red-600"}`}
            >
              {pesanPromo}
            </p>
          )}
        </div>

        <div className="flex-1 space-y-2 text-sm text-slate-700 font-medium">
          <p className="flex justify-between">
            <span>Subtotal:</span> <span>{rupiah(subtotal)}</span>
          </p>
          {diskon > 0 && (
            <p className="flex justify-between text-green-600">
              <span>Diskon:</span> <span>-{rupiah(diskon)}</span>
            </p>
          )}
          {caraAmbil === "diantar" && (
            <p className="flex justify-between">
              <span>Ongkir:</span> <span>{rupiah(ongkir)}</span>
            </p>
          )}
          <p className="flex justify-between text-lg font-bold text-orange-600 border-t pt-2 mt-2">
            <span>Total:</span> <span>{rupiah(total)}</span>
          </p>
        </div>
      </div>

      {/* Form Checkout */}
      <form onSubmit={prosesPesanan} className="mt-8 space-y-4 border-t pt-6">
        <h2 className="text-lg font-bold">Detail Pengiriman</h2>

        <div className="flex gap-4 mb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="sendiri"
              checked={caraAmbil === "sendiri"}
              onChange={(e) => setCaraAmbil(e.target.value)}
            />
            Ambil sendiri
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="diantar"
              checked={caraAmbil === "diantar"}
              onChange={(e) => setCaraAmbil(e.target.value)}
            />
            Diantar (+Rp 2.000)
          </label>
        </div>

        <input
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Nama pemesan (min. 3 huruf)"
          className="w-full rounded border px-3 py-2"
        />

        {caraAmbil === "diantar" && (
          <input
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
            placeholder="Kelas (contoh: XII RPL 1)"
            className="w-full rounded border px-3 py-2"
          />
        )}

        {pesanError && (
          <p className="text-sm text-red-600 font-medium">{pesanError}</p>
        )}

        <button
          type="submit"
          className="w-full rounded bg-orange-600 px-4 py-3 font-bold text-white hover:bg-orange-700"
        >
          Pesan Sekarang
        </button>
      </form>
    </div>
  );
}
