import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// AMBIL DATA SUPPLIER
export const GET = async (req) => {
  try {
    const allSupplier = await prisma.supplier.findMany();

    return NextResponse.json(allSupplier);
  } catch (error) {
    console.log("Gagal ambil data supplier: ", error);
    return NextResponse.json(
      { message: "Kesalahan Pada Server!" },
      { status: 500 }
    );
  }
};

// BUAT DATA SUPPLIER
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

    const { nama, kontak, alamat } = body;

    if (!nama) {
      return NextResponse.json({ message: "Isi semua form!" }, { status: 400 });
    }

    const newSupplier = await prisma.supplier.create({
      data: {
        nama: nama,
        kontak: kontak,
        alamat: alamat,
      },
    });

    return NextResponse.json(
      { newSupplier, message: "Supplier berhasil dibuat!" },
      { status: 201 }
    );
  } catch (error) {
    console.log("gagal menambahkan supplier:", error);

    return NextResponse.json(
      { message: "Kesalahan Pada Server!" },
      { status: 500 }
    );
  }
};

// EDIT DATA SUPPLIER
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

    const { id, nama, kontak, alamat } = body;

    if (!nama) {
      return NextResponse.json({ message: "Isi semua form!" }, { status: 400 });
    }

    const updateSupplier = await prisma.supplier.update({
      where: {
        id: id,
      },
      data: {
        nama: nama,
        kontak: kontak,
        alamat: alamat,
      },
    });

    if (!updateSupplier) {
      return NextResponse.json(
        { message: "Pemasok tidak ditemukan!" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { updateSupplier, message: "Pemasok berhasil diupdate!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("gagal edit data pemasok: ", error);

    return NextResponse.json(
      { message: "Kesalahan Pada Server!" },
      { status: 500 }
    );
  }
};

// HAPUS DATA SUPPLIER
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

    const { id } = body;

    const deleteSupplier = await prisma.supplier.delete({
      where: {
        id: id,
      },
    });

    if (!deleteSupplier) {
      return NextResponse.json(
        { message: "Pemasok tidak ditemukan!" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { deleteSupplier, message: "Pemasok berhasil dihapus!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("gagal hapus data pemasok: ", error);

    return NextResponse.json(
      { message: "Kesalahan Pada Server!" },
      { status: 500 }
    );
  }
};
