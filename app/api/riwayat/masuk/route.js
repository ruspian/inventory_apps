// app/api/riwayat/masuk/route.js

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const GET = async (req) => {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Akses ditolak!" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);

    // ambil parameter filter dari query
    const filter = searchParams.get("filter") || "harian"; // Default ke 'harian'
    const isExport = searchParams.get("export") === "true";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // kondisi where
    const now = new Date();
    let tanggalMulai;
    let tanggalSelesai = new Date(now);

    // Set Tanggal Mulai berdasarkan filter
    switch (filter) {
      case "harian":
        tanggalMulai = new Date(now.setHours(0, 0, 0, 0));
        tanggalSelesai = new Date(now.setHours(23, 59, 59, 999));
        break;
      case "mingguan":
        const hariIni = now.getDay();
        const diff = now.getDate() - hariIni + (hariIni === 0 ? -6 : 1);
        tanggalMulai = new Date(now.setDate(diff));
        tanggalMulai.setHours(0, 0, 0, 0);
        break;
      case "bulanan":
        tanggalMulai = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "tahunan":
        tanggalMulai = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        tanggalMulai = new Date(now.setHours(0, 0, 0, 0));
        tanggalSelesai = new Date(now.setHours(23, 59, 59, 999));
    }

    // payload where
    const mainWhere = {
      tipe: "MASUK",
      createdAt: {
        gte: tanggalMulai,
        lte: tanggalSelesai,
      },
    };

    if (isExport) {
      // export sesuai filter tanggal
      const dataEkspor = await prisma.riwayatStok.findMany({
        where: mainWhere, // Pakai filter tanggal
        include: { barang: true, user: true, supplier: true },
        orderBy: { createdAt: "desc" }, // Urutkan berdasarkan tanggal
      });
      return NextResponse.json({ data: dataEkspor }, { status: 200 });
    }

    // jika tidak export maka ambil data untuk pagination
    const [riwayatMasuk, totalCount] = await prisma.$transaction([
      prisma.riwayatStok.findMany({
        where: mainWhere,
        include: { barang: true, user: true, supplier: true },
        orderBy: { createdAt: "desc" }, // Urutkan berdasarkan tanggal
        skip: skip,
        take: limit,
      }),
      prisma.riwayatStok.count({ where: mainWhere }),
    ]);

    // kembalikan response
    return NextResponse.json(
      { data: riwayatMasuk, totalCount: totalCount },
      { status: 200 }
    );
  } catch (error) {
    console.log("gagal mengambil data stok masuk: ", error);
    return NextResponse.json(
      { message: "Kesalahan Pada Server!" },
      { status: 500 }
    );
  }
};
