import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET ALL DATA STOK MASUK
export const GET = async (req) => {
  try {
    const allRiwayat = await prisma.riwayatStok.findMany({
      include: {
        barang: true,
        user: true,
        supplier: true,
      },
    });

    return NextResponse.json(allRiwayat);
  } catch (error) {
    console.log("gagal mengambil data stok masuk: ", error);

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
