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
    nama: "Nasi Goreng",
    kategori: "Makanan",
    harga: 15000,
    stok: 10,
  },
  {
    id: 2,
    nama: "Mie Goreng",
    kategori: "Makanan",
    harga: 12000,
    stok: 12,
  },
  {
    id: 3,
    nama: "Teh",
    kategori: "Minuman",
    harga: 5000,
    stok: 20,
  },
  {
    id: 4,
    nama: "Kopi",
    kategori: "Minuman",
    harga: 7000,
    stok: 15,
  },
  {
    id: 5,
    nama: "esjeruk",
    kategori: "Minuman",
    harga: 5000,
    stok: 15,
  },
  {
    id: 5,
    nama: "basreng",
    kategori: "Minuman",
    harga: 8000,
    stok: 15,
  },
];

export function rupiah(n: number) {
  return "rp " + n.toLocaleString("id-ID");
}
