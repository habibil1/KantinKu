export type Menu = {
  id: number;
  nama: string;
  kategori: string;
  harga: number;
  stok: number;
};

export const Menu: Menu[] = [
  {
    id: 1,
    nama: "Nasi Goreng spesial",
    kategori: "Makanan",
    harga: 12000,
    stok: 15,
  },
  {
    id: 2,
    nama: "Es Teh Manis",
    kategori: "Minuman",
    harga: 3000,
    stok: 40,
  },
  {
    id: 3,
    nama: "Jus Alpukat",
    kategori: "Minuman",
    harga: 5000,
    stok: 0,
  },
  {
    id: 4,
    nama: "Pisang Goreng",
    kategori: "Makanan",
    harga: 5000,
    stok: 20,
  },
  {
    id: 5,
    nama: "Risol Mayo",
    kategori: "Makanan",
    harga: 3000,
    stok: 3,
  },
  {
    id: 6,
    nama: "Mie Ayam",
    kategori: "Makanan",
    harga: 10000,
    stok: 8,
  },
];

export function rupiah(n: number) {
  return "rp " + n.toLocaleString("id-ID");
}
