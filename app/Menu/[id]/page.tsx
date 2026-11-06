import { notFound } from "next/navigation";
import { menuKantin } from "@/data/menu";

export default async function DetailMenu({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const menu = menuKantin.find((m) => m.id === Number(id));

  if (!menu) {
    notFound();
  }

  return (
    <div className="max-w-xl mx-auto border rounded-xl p-6 bg-white mt-10 shadow-sm">
      <h1 className="text-3xl font-bold mb-2">{menu.nama}</h1>
      <p className="text-gray-500 mb-4">{menu.kategori}</p>

      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
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
    </div>
  );
}
