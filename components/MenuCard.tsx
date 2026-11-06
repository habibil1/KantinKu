import Link from "next/link";
import { Menu } from "@/data/menu";
export default function MenuCard({ menu }: { menu: Menu }) {
  return (
    <Link
      href={`/menu/${menu.id}`}
      className="border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white block"
    >
      <h3 className="font-bold text-lg">{menu.nama}</h3>
      <p className="text-sm text-gray-500">{menu.kategori}</p>
      <p className="text-blue-600 font-semibold mt-2">
        Rp {menu.harga.toLocaleString("id-ID")}
      </p>

      <p
        className={`text-sm font-medium mt-1 ${menu.stok === 0 ? "text-red-500" : "text-green-600"}`}
      >
        {menu.stok === 0 ? "Habis" : `Stok: ${menu.stok}`}
      </p>
    </Link>
  );
}
