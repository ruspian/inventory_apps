import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
