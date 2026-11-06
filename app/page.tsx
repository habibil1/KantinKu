import Link from "next/link";

export default function Beranda() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center gap-6">
      <h1 className="text-4xl font-bold">Selamat Datang di KantinKu</h1>
      <p className="text-lg text-gray-600">
        Pesan makanan dan minuman favoritmu di sini!
      </p>
      <Link
        href="/menu"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
      >
        Lihat Menu
      </Link>
    </div>
  );
}
