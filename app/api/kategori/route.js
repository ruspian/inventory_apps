import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// AMBIL DATA KATEGORI
export const GET = async (req) => {
  try {
    const allKategori = await prisma.kategori.findMany();

    if (!allKategori) {
      return NextResponse.json(
        { message: "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(allKategori);
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
