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

    if (isNaN(jumlahInt) || isNaN(stokSebelumInt) || isNaN(stokSesudahInt)) {
      return NextResponse.json(
        { message: "Jumlah harus berupa angka!" },
        { status: 400 }
      );
    }

    const newRiwayat = await prisma.riwayatStok.create({
      data: {
        tipe: tipe,
        barangId: barangId,
        stokSebelum: stokSebelumInt,
        jumlah: jumlahInt,
        stokSesudah: stokSesudahInt,
        catatan: catatan,
        userId: userId,
        supplierId: supplierId,
      },
    });

    return NextResponse.json(
      { newRiwayat, message: "Riwayat berhasil dibuat!" },
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
