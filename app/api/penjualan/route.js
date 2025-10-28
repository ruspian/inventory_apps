import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"; // Sesuaikan path jika beda

export const POST = async (req) => {
  const session = await auth();

  //   pastikan user sudah login dan role admin
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { message: "Anda tidak memiliki akses!" },
      { status: 401 }
    );
  }
  // Ambil ID user untuk catatan riwayat
  const userId = session.user.id;

  try {
    // Ambil Data dari Body
    const body = await req.json();
    const { total, dibayar, kembalian, items } = body;

    // pastikan data keranjang ada
    if (!items || items.length === 0) {
      return NextResponse.json(
        { message: "Keranjang belanja kosong!" },
        { status: 400 }
      );
    }

    // pastikan data pembayaran lengkap
    if (total === undefined || dibayar === undefined) {
      return NextResponse.json(
        { message: "Data pembayaran tidak lengkap" },
        { status: 400 }
      );
    }

    // pastikan semua query berhasil, atau semua dibatalkan
    const penjualan = await prisma.$transaction(async (tx) => {
      //  buat Struk di model Penjualan
      const struk = await tx.penjualan.create({
        data: {
          total: total,
          dibayar: dibayar,
          kembalian: kembalian,
        },
      });

      // Loop setiap item di keranjang
      for (const item of items) {
        //  Buat Item Struk di model PenjualanDetail
        await tx.penjualanDetail.create({
          data: {
            penjualanId: struk.id,
            barangId: item.barangId,
            jumlah: item.jumlah,
            hargaSatuan: item.hargaSatuan,
            subTotal: item.subTotal,
          },
        });

        // JIKA itemnya adalah BARANG bukan JASA, update stoknya
        if (item.tipe === "BARANG") {
          // Ambil stok terbaru dulu dari model Barang
          const barang = await tx.barang.findUnique({
            where: { id: item.barangId },
            select: { stok: true, nama: true },
          });

          if (!barang) {
            // Jika barang  dihapus, batalkan transaksi
            throw new Error(`Barang ${item.barangId} tidak ditemukan.`);
          }

          const stokSebelum = barang.stok;
          const stokSesudah = stokSebelum - item.jumlah;

          // Cek ketersediaan stok
          if (stokSesudah < 0) {
            // Jika stok tidak cukup, batalkan seluruh transaksi
            throw new Error(`Stok ${barang.nama} tidak mencukupi!`);
          }

          // Update stok di model Barang
          await tx.barang.update({
            where: { id: item.barangId },
            data: { stok: stokSesudah },
          });

          // Buat catatan di RiwayatStok
          await tx.riwayatStok.create({
            data: {
              tipe: "KELUAR", // Tipe KELUAR karena penjualan
              jumlah: -item.jumlah, // Stok keluar dicatat sebagai negatif
              stokSebelum: stokSebelum,
              stokSesudah: stokSesudah,
              barangId: item.barangId,
              userId: userId, // User yang login
            },
          });
        }
      }

      return struk; // Kembalikan data struk jika transaksi sukses
    });

    // 5. Transaksi Sukses
    return NextResponse.json(
      { message: "Transaksi berhasil disimpan!", data: penjualan },
      { status: 201 }
    );
  } catch (error) {
    console.error("Gagal membuat transaksi:", error);

    // Kirim pesan error yang spesifik jika itu error stok
    if (error.message.includes("Stok") || error.message.includes("mencukupi")) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    // Error server umum
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server!" },
      { status: 500 }
    );
  }
};

// AMBIL DATA PENJUALAN
export const GET = async (req) => {
  try {
    const penjualan = await prisma.penjualan.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        detail: {
          include: {
            barang: true,
          },
        },
      },
    });

    return NextResponse.json(penjualan, { status: 200 });
  } catch (error) {
    console.log("gagal mengambil data penjualan", error);

    return NextResponse.json(
      {
        message: "Terjadi kesalahan pada server!",
      },
      { status: 500 }
    );
  }
};
