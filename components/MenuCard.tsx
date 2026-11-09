import Link from "next/link";
import { type Menu, rupiah } from "@/data/menu";

interface MenuCardProps {
  item?: Menu;
  menu?: Menu;
}

export default function MenuCard({ item, menu }: MenuCardProps) {
  const data = item || menu;
  if (!data) return null;

  return (
    <Link
      href={`/menu/${data.id}`}
      className="border rounded-xl p-5 shadow-sm hover:shadow-md transition bg-white block"
    >
      <h3 className="font-bold text-xl text-gray-900 mb-1">{data.nama}</h3>
      <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-md mb-3">
        {data.kategori}
      </span>
      <p className="text-blue-600 font-bold text-lg mb-2">
        {rupiah(data.harga)}
      </p>

      <p
        className={`text-sm font-semibold ${
          data.stok === 0 ? "text-red-500" : "text-green-600"
        }`}
      >
        {data.stok === 0 ? "Habis" : `Stok: ${data.stok}`}
      </p>
    </Link>
  );
}
