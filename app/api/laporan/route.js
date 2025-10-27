import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = async (req) => {
  try {
    const laporan = await prisma.penjualan.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(laporan);
  } catch (error) {
    console.log("gagal mendapatkan data laporan penjualan:", error);

    return NextResponse.json(
      {
        message: "Terjadi kesalahan pada server!",
      },
      { status: 500 }
    );
  }
};
