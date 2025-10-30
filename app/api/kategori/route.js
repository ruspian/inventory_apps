import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// AMBIL DATA KATEGORI
export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);

    // 1. Ambil Query Parameter
    const search = searchParams.get("search") || "";
    const pageParam = searchParams.get("page"); // Cek apakah ada parameter page
    const limitParam = searchParams.get("limit"); // Cek apakah ada parameter limit

    // Buat where clause untuk search berdasarkan nama
    const whereClause = {
      OR: [
        {
          nama: {
            contains: search,
            mode: "insensitive", // Tidak peduli huruf besar/kecil
          },
        },
      ],
    };

    // Cek apakah pagination diminta
    if (pageParam && limitParam) {
      const page = parseInt(pageParam) || 1;
      const limit = parseInt(limitParam) || 10;
      const skip = (page - 1) * limit;

      const [kategori, totalCount] = await prisma.$transaction([
        prisma.kategori.findMany({
          where: whereClause,
          orderBy: { nama: "asc" },
          skip: skip,
          take: limit,
        }),
        prisma.kategori.count({
          where: whereClause,
        }),
      ]);

      if (totalCount === 0 && search !== "") {
        return NextResponse.json(
          {
            message: "Kategori tidak ditemukan!",
            data: [],
            totalCount: 0,
          },
          { status: 200 }
        );
      }

      // Kembalikan data pagination
      return NextResponse.json(
        {
          data: kategori,
          totalCount: totalCount,
        },
        { status: 200 }
      );
    } else {
      const allKategori = await prisma.kategori.findMany({
        where: whereClause,
        orderBy: { nama: "asc" },
      });

      // Jika tidak ada data kategori
      if (allKategori.length === 0 && search !== "") {
        return NextResponse.json(
          {
            message: "Kategori tidak ditemukan!",
            data: [],
            totalCount: 0,
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        {
          data: allKategori,
          totalCount: allKategori.length,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("Gagal ambil data kategori: ", error);
    return NextResponse.json(
      { message: "Kesalahan Pada Server!" },
      { status: 500 }
    );
  }
};

// BUAT DATA KATEGORI
export const POST = async (req) => {
  const session = await auth();

  // pastikan user sudah login dan role admin
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { message: "Anda tidak memiliki akses!" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { nama } = body;

    // Pastikan nama adalah array
    if (!Array.isArray(nama)) {
      return NextResponse.json(
        { message: "Format data tidak valid. Harus berupa array nama." },
        { status: 400 }
      );
    }

    // Cek duplikat dalam input
    const isDuplicateInput = new Set(nama).size !== nama.length;
    if (isDuplicateInput) {
      return NextResponse.json(
        { message: "Nama kategori tidak boleh duplikat dalam input!" },
        { status: 400 }
      );
    }

    // Ambil semua kategori yang sudah ada di database
    const existingKategori = await prisma.kategori.findMany({
      where: {
        nama: {
          in: nama,
        },
      },
      select: { nama: true },
    });

    // Cek apakah ada nama kategori yang sudah terdaftar
    if (existingKategori.length > 0) {
      const existingNames = existingKategori.map((k) => k.nama).join(", ");
      return NextResponse.json(
        {
          message: `${existingNames} sudah ada, silakan gunakan nama lain!`,
        },
        { status: 400 }
      );
    }

    // createMany butuh array of objects
    const newKategori = await prisma.kategori.createMany({
      data: nama.map((n) => ({ nama: n })),
    });

    return NextResponse.json(
      { newKategori, message: "Semua kategori berhasil dibuat!" },
      { status: 201 }
    );
  } catch (error) {
    console.log("Kesalahan buat data kategori: ", error);

    return NextResponse.json(
      { message: "Kesalahan Pada Server!" },
      { status: 500 }
    );
  }
};

// EDIT KATEGORI
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

    const { id, nama } = body;

    const updateKategori = await prisma.kategori.update({
      where: {
        id: id,
      },
      data: {
        nama: nama,
      },
    });

    if (!updateKategori) {
      return NextResponse.json(
        { message: "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        updateKategori,
        message: "Kategori berhasil diupdate!",
      },
      { status: 200 }
    );
  } catch {
    console.log("Kesalahan");

    return NextResponse.json(
      { message: "Kesalahan Pada Server!" },
      { status: 500 }
    );
  }
};

// HAPUS KATEGORI
export const DELETE = async (req) => {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { message: "Anda tidak memiliki akses!" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    // destructure id dari body
    const { id } = body;

    // cari kategori berdasarkan id dan hapus
    const deleteKategori = await prisma.kategori.delete({
      where: {
        id: id,
      },
    });

    // jika id kategori tidak ditemukan
    if (!deleteKategori) {
      return NextResponse.json(
        { message: "Kategori tidak ditemukan!" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        deleteKategori,
        message: "Kategori berhasil dihapus!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("gagal menghapus kategori: ", error);

    return NextResponse.json(
      { message: "Kesalahan Pada Server!" },
      { status: 500 }
    );
  }
};
