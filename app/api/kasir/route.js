import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const kodeBarang = searchParams.get("kodeBarang");

    // pastikan kode barang ada
    if (!kodeBarang) {
      return NextResponse.json(
        {
          message: "Kode barang tidak ada!",
        },
        { status: 400 }
      );
    }

    // cari barang berdasarkan kode barang
    const barang = await prisma.barang.findFirst({
      where: {
        kodeBarang: kodeBarang,
      },
    });

    // cek apakah barang ditemukan
    if (!barang) {
      return NextResponse.json(
        {
          message: "Barang tidak ditemukan!",
        },
        { status: 404 }
      );
    }

    // cek apakah barang bertipe barang dan stok ada
    if (barang.tipe === "BARANG" || barang.stok <= 0) {
      return NextResponse.json(
        {
          message: "Stok barang kosong!",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(barang, { status: 200 });
  } catch (error) {
    console.log("gagal saat mengambil data barang", error);

    return NextResponse.json(
      {
        message: "Terjadi kesalahan pada server!",
      },
      { status: 500 }
    );
  }
};
