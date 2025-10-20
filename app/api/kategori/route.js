import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

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
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
