import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET ALL DATA STOK MASUK
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

    const mainWhere = {
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
    const [riwayat, totalCount] = await prisma.$transaction([
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
      { data: riwayat, totalCount: totalCount },
      { status: 200 }
    );
  } catch (error) {
    console.log("gagal mengambil data riwayat stok: ", error);

    return NextResponse.json(
      { message: "Kesalahan Pada Server!" },
      { status: 500 }
    );
  }
};

// BUAT DATA RIWAYAT STOK
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
      supplierId,
    } = body;

    if (
      !tipe ||
      !barangId ||
      !stokSebelum ||
      !jumlah ||
      !stokSesudah ||
      !userId ||
      !supplierId
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

      const stokBaru =
        tipe === "MASUK" ? barang.stok + jumlahInt : barang.stok - jumlahInt;

      // simpan data riwayat
      const newRiwayat = await tx.riwayatStok.create({
        data: {
          tipe: tipe,
          barangId: barangId,
          stokSebelum: barang.stok,
          jumlah: jumlahInt,
          stokSesudah: stokBaru,
          catatan: catatan,
          userId: userId,
          supplierId: supplierId,
        },
      });

      // update stok di data barang
      await tx.barang.update({
        where: {
          id: barangId,
        },
        data: {
          stok: stokBaru,
        },
      });

      return newRiwayat;
    });

    return NextResponse.json(
      { result, message: "Riwayat berhasil dibuat!" },
      { status: 201 }
    );
  } catch (error) {
    console.log("gagal membuat riwayat: ", error);

    return NextResponse.json(
      { message: "Kesalahan Pada Server!" },
      { status: 500 }
    );
  }
};

// EDIT DATA RIWAYAT STOK
export const PUT = async (req) => {
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
      id,
      tipe,
      barangId,
      stokSebelum,
      jumlah,
      stokSesudah,
      catatan,
      userId,
      supplierId,
    } = body;

    if (
      !id ||
      !tipe ||
      !barangId ||
      !stokSebelum ||
      !jumlah ||
      !stokSesudah ||
      !userId ||
      !supplierId
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
      // cari riwayat sebelumnya berdasarkan id
      const riwayatSebelumnya = await tx.riwayatStok.findUnique({
        where: {
          id: id,
        },
      });

      // jika riwayat sebelumnya tidak ditemukan
      if (!riwayatSebelumnya) throw new Error("Riwayat tidak ditemukan!");

      // cari barang berdasarkan id
      const barang = await tx.barang.findUnique({
        where: {
          id: barangId,
        },
      });

      // jika barang tidak ditemukan
      if (!barang) throw new Error("Barang tidak ditemukan!");

      //   hitung stok baru
      let stokBaru = barang.stok;

      if (tipe === "MASUK") {
        stokBaru = barang.stok - riwayatSebelumnya.jumlah + jumlahInt;
      }

      // simpan data riwayat
      const updatedRiwayat = await tx.riwayatStok.update({
        where: {
          id: id,
        },
        data: {
          tipe: tipe,
          barangId: barangId,
          stokSebelum: stokSebelumInt,
          jumlah: jumlahInt,
          stokSesudah: stokBaru,
          catatan: catatan,
          userId: userId,
          supplierId: supplierId,
        },
      });

      // update stok di data barang
      await tx.barang.update({
        where: {
          id: barangId,
        },
        data: {
          stok: stokBaru,
        },
      });

      return updatedRiwayat;
    });

    return NextResponse.json(
      { result, message: "Riwayat berhasil dibuat!" },
      { status: 201 }
    );
  } catch (error) {
    console.log("gagal membuat riwayat: ", error);

    return NextResponse.json(
      { message: "Kesalahan Pada Server!" },
      { status: 500 }
    );
  }
};
