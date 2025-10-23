import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET ALL DATA STOK MASUK
export const GET = async (req) => {
  try {
    const body = await req.json();

    const { tipe } = body;

    const allStokMasuk = await prisma.riwayatStok.findMany(
      tipe === "MASUK"
        ? {
            where: {
              tipe: tipe,
            },
          }
        : {}
    );

    return NextResponse.json(allStokMasuk);
  } catch (error) {
    console.log("gagal mengambil data stok masuk: ", error);

    return NextResponse.json(
      { message: "Kesalahan Pada Server!" },
      { status: 500 }
    );
  }
};
