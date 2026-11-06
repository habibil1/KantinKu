import Link from "next/link";
import { type Menu } from "@/data/menu";

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
      className="border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white block"
    >
      <h3 className="font-bold text-lg">{data.nama}</h3>
      <p className="text-sm text-gray-500">{data.kategori}</p>
      <p className="text-blue-600 font-semibold mt-2">
        Rp {data.harga.toLocaleString("id-ID")}
      </p>

      <p
        className={`text-sm font-medium mt-1 ${
          data.stok === 0 ? "text-red-500" : "text-green-600"
        }`}
      >
        {data.stok === 0 ? "Habis" : `Stok: ${data.stok}`}
      </p>
    </Link>
  );
}
