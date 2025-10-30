import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const GET = async (req) => {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { message: "Anda tidak memiliki akses!" },
      { status: 401 }
    );
  }

  try {
    const riwayatMasuk = await prisma.riwayatStok.findMany({
      where: {
        tipe: "MASUK",
      },
      include: {
        barang: true,
        user: true,
        supplier: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(riwayatMasuk, { status: 200 });
  } catch (error) {
    console.log("gagal mengambil data stok masuk: ", error);

    return NextResponse.json(
      { message: "Kesalahan Pada Server!" },
      { status: 500 }
    );
  }
};
