import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Prisma } from "@prisma/client";

// BUAT DATA BARANG
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
      nama,
      stok,
      satuan,
      hargaBeli,
      hargaJual,
      kategoriId,
      kodeBarang,
      deskripsi,
    } = body;

    // pastikan semua form diisi
    if (
      !nama ||
      !stok ||
      !satuan ||
      !hargaBeli ||
      !hargaJual ||
      !kategoriId ||
      !kodeBarang
    ) {
      return NextResponse.json({ message: "Isi semua form!" }, { status: 400 });
    }

    // convert Tipe Data ke Integer
    const stokInt = parseInt(stok);
    const hargaBeliInt = parseInt(hargaBeli);
    const hargaJualInt = parseInt(hargaJual);

    // Pastikan konversi berhasil
    if (isNaN(stokInt) || isNaN(hargaBeliInt) || isNaN(hargaJualInt)) {
      return NextResponse.json(
        { message: "Stok dan Harga harus berupa angka!" },
        { status: 400 }
      );
    }
    const createBarang = await prisma.barang.create({
      data: {
        nama,
        stok: stokInt,
        satuan,
        deskripsi,
        hargaBeli: hargaBeliInt,
        hargaJual: hargaJualInt,
        kategoriId,
        kodeBarang,
      },
    });

    return NextResponse.json(
      { createBarang, message: "Barang berhasil ditambahkan!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Gagal membuat barang:", error);

    // jika ada data duplikat
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target = error.meta?.target;
        if (target?.includes("nama")) {
          return NextResponse.json(
            { message: "Nama barang ini sudah ada!" },
            { status: 409 } // 409 = konflik
          );
        }
        if (target?.includes("kodeBarang")) {
          return NextResponse.json(
            { message: "Kode barang ini sudah ada!" },
            { status: 409 }
          );
        }
      }
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

// AMBIL DATA BARANG
export const GET = async (req) => {
  try {
    const allBarang = await prisma.barang.findMany({
      orderBy: {
        nama: "asc",
      },
      include: {
        kategori: true,
      },
    });

    return NextResponse.json(allBarang, { status: 200 });
  } catch (error) {
    console.log("error get barang", error);

    return NextResponse.json(
      { message: "Terjadi Kesalahan Server!" },
      { status: 500 }
    );
  }
};

// EDIT DATA BARANG
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
      nama,
      stok,
      satuan,
      hargaBeli,
      hargaJual,
      kategoriId,
      kodeBarang,
      deskripsi,
    } = body;

    // pastikan semua form diisi
    if (
      !id ||
      !nama ||
      !stok ||
      !satuan ||
      !hargaBeli ||
      !hargaJual ||
      !kategoriId ||
      !kodeBarang
    ) {
      return NextResponse.json({ message: "Isi semua form!" }, { status: 400 });
    }

    const stokInt = parseInt(stok);
    const hargaBeliInt = parseInt(hargaBeli);
    const hargaJualInt = parseInt(hargaJual);

    if (isNaN(stokInt) || isNaN(hargaBeliInt) || isNaN(hargaJualInt)) {
      return NextResponse.json(
        { message: "Stok dan Harga harus berupa angka!" },
        { status: 400 }
      );
    }

    const updateBarang = await prisma.barang.update({
      where: {
        id: id,
      },
      data: {
        nama,
        stok: stokInt,
        satuan,
        deskripsi,
        hargaBeli: hargaBeliInt,
        hargaJual: hargaJualInt,
        kategoriId,
        kodeBarang,
      },
    });

    return NextResponse.json(
      { updateBarang, message: "Barang berhasil diupdate!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("gagal update barang", error);

    return NextResponse.json(
      { message: "Kesalahan Pada Server!" },
      { status: 500 }
    );
  }
};
