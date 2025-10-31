import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "404 Not Found",
  description: "Halaman tidak ditemukan",
};

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <Image src="/notfound.gif" alt="404" width={700} height={700} />

      <h1 className="text-3xl font-extrabold text-emerald-600 mt-4">
        WALAH WE, KAYAKNYA LO NYASAR
      </h1>
      <p className="text-lg mt-2 text-gray-600">
        Balik Ke Halaman Utama?{" "}
        <Link href="/" className="text-emerald-600 f hover:underline">
          Klik Disini Nih!
        </Link>
      </p>
    </div>
  );
};

export default NotFoundPage;
