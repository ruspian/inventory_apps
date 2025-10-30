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
    const { searchParams } = new URL(req.url);

    // 1. Ambil Query Parameter
    const search = searchParams.get("search") || "";
    const pageParam = searchParams.get("page"); // Cek apakah ada parameter page
    const limitParam = searchParams.get("limit"); // Cek apakah ada parameter limit

    // Buat where clause untuk search
    const whereClause = {
      OR: [
        {
          nama: {
            contains: search,
            mode: "insensitive", // Tidak peduli huruf besar/kecil
          },
        },
        {
          kodeBarang: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    };

    // Cek apakah pagination diminta
    if (pageParam && limitParam) {
      const page = parseInt(pageParam) || 1;
      const limit = parseInt(limitParam) || 10;
      const skip = (page - 1) * limit;

      // Jalankan query dengan $transaction
      const [barang, totalCount] = await prisma.$transaction([
        prisma.barang.findMany({
          where: whereClause,
          include: { kategori: true },
          orderBy: { nama: "asc" },
          skip: skip,
          take: limit,
        }),
        prisma.barang.count({
          where: whereClause,
        }),
      ]);

      // Kembalikan data pagination
      return NextResponse.json(
        {
          data: barang,
          totalCount: totalCount,
        },
        { status: 200 }
      );
    } else {
      // Ambil SEMUA barang yang cocok dengan pencarian (jika ada)
      const allBarang = await prisma.barang.findMany({
        where: whereClause,
        include: {
          kategori: true,
        },
        orderBy: {
          nama: "asc",
        },
      });

      // Kembalikan semua data
      return NextResponse.json(
        {
          data: allBarang,
          totalCount: allBarang.length, // Totalnya adalah jumlah yang ditemukan
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("error get all barang", error);
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

// HAPUS DATA BARANG
export const DELETE = async (req) => {
  const session = await auth();

  // pastikan user sudah login dan role admin
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { message: "Anda tidak memiliki akses!" },
      { status: 401 }
    );
  }

  try {
    // ambil data dari body
    const body = await req.json();

    const { id } = body;

    // cari barang berdasarkan id
    const deleteBarang = await prisma.barang.delete({
      where: {
        id: id,
      },
    });

    // jika id barang tidak ditemukan
    if (!deleteBarang) {
      return NextResponse.json(
        { message: "Barang tidak ditemukan!" },
        { status: 404 }
      );
    }

    // kembalikan response berhasil
    return NextResponse.json(
      { deleteBarang, message: "Barang berhasil dihapus!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("gagal hapus barang", error);

    return NextResponse.json(
      { message: "Kesalahan Pada Server!" },
      { status: 500 }
    );
  }
};
