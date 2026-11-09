import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-4">
      <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-4">
        Selamat Datang di KantinKu
      </h1>
      <p className="text-lg md:text-xl text-gray-600 max-w-xl mb-8">
        Pesan makanan dan minuman favoritmu dari kantin sekolah dengan mudah, cepat, dan praktis!
      </p>
      <Link
        href="/menu"
        className="bg-blue-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-blue-700 transition shadow-md"
      >
        Lihat Menu
      </Link>
    </div>
  );
}
