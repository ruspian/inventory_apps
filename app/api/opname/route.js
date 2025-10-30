import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET DATA OPNAME
export const GET = async (req) => {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Akses ditolak!" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);

    // ambil parameter filter dari query
    const filter = searchParams.get("filter") || "semua"; // Default ke 'semua'
    const isExport = searchParams.get("export") === "true";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // payload where
    let mainWhere = {
      tipe: "OPNAME",
    };

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
      case "semua":
      default:
        break;
    }

    // jika tanggalMulai ada
    if (tanggalMulai) {
      mainWhere.createdAt = {
        gte: tanggalMulai,
        lte: tanggalSelesai,
      };
    }

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
    const [opname, totalCount] = await prisma.$transaction([
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
      { data: opname, totalCount: totalCount },
      { status: 200 }
    );
  } catch (error) {
    console.log("gagal mengambil data stok opname: ", error);
    return NextResponse.json(
      { message: "Kesalahan Pada Server!" },
      { status: 500 }
    );
  }
};

// BUAT DATA OPNAME
export const POST = async (req) => {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { message: "Anda tidak memiliki akses!" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    const {
      tipe,
      barangId,
      stokSebelum,
      jumlah,
      stokSesudah,
      catatan,
      userId,
    } = body;

    if (
      !tipe ||
      !barangId ||
      !stokSebelum ||
      !jumlah ||
      !stokSesudah ||
      !userId
    ) {
      return NextResponse.json({ message: "Isi semua form!" }, { status: 400 });
    }

    const jumlahInt = parseInt(jumlah);
    const stokSebelumInt = parseInt(stokSebelum);
    const stokSesudahInt = parseInt(stokSesudah);

    // pastikan data ini adalah angka
    if (isNaN(jumlahInt) || isNaN(stokSebelumInt) || isNaN(stokSesudahInt)) {
      return NextResponse.json(
        { message: "Jumlah harus berupa angka!" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // cari barang berdasarkan id
      const barang = await tx.barang.findUnique({
        where: {
          id: barangId,
        },
      });

      // jika barang tidak ditemukan
      if (!barang) throw new Error("Barang tidak ditemukan!");

      // simpan data riwayat
      const newOpname = await tx.riwayatStok.create({
        data: {
          tipe: tipe,
          barangId: barangId,
          stokSebelum: stokSebelumInt,
          jumlah: jumlahInt,
          stokSesudah: stokSesudahInt,
          catatan: catatan,
          userId: userId,
        },
      });

      // update stok di data barang
      await tx.barang.update({
        where: {
          id: barangId,
        },
        data: {
          stok: stokSesudahInt,
        },
      });

      return newOpname;
    });

    return NextResponse.json(
      { result, message: "Opname berhasil dibuat!" },
      { status: 201 }
    );
  } catch (error) {
    console.log("gagal membuat opname: ", error);

    return NextResponse.json(
      { message: "Kesalahan Pada Server!" },
      { status: 500 }
    );
  }
};
