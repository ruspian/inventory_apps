import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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
    // rentang waktu hari ini
    const todayGte = new Date(new Date().setHours(0, 0, 0, 0));
    const todayLte = new Date(new Date().setHours(23, 59, 59, 999));
    const whereToday = { createdAt: { gte: todayGte, lte: todayLte } };

    // query barang menipis
    const barangMenipisQuery = prisma.barang.findMany({
      where: { tipe: "BARANG", stok: { lte: 10 } },
      include: { kategori: true },
      orderBy: { stok: "asc" },
      take: 5,
    });

    // queri barang terlaris
    const topBarangDataQuery = prisma.penjualanDetail.groupBy({
      by: ["barangId"],
      _sum: { jumlah: true },
      orderBy: { _sum: { jumlah: "desc" } },
      take: 5,
    });

    // queri transaksi terakhir
    const transaksiTerakhirQuery = prisma.penjualan.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { detail: { include: { barang: true } } },
    });

    // query omset hari ini
    const omsetQuery = prisma.penjualan.aggregate({
      where: whereToday,
      _sum: { total: true }, // Jumlahkan total
      _count: { id: true }, // Hitung jumlah id
    });

    // queri profit hari ini
    const profitQuery = prisma.penjualanDetail.findMany({
      where: {
        penjualan: whereToday,
        barang: { tipe: "BARANG" }, // Jasa tidak dihitung
      },
      include: {
        barang: { select: { hargaBeli: true, hargaJual: true } },
      },
    });

    // Jalankan semuanya secara bersamaan
    const [
      barangMenipis,
      topBarangData,
      transaksiTerakhir,
      omsetHariIni,
      profitDetails,
    ] = await Promise.all([
      barangMenipisQuery,
      topBarangDataQuery,
      transaksiTerakhirQuery,
      omsetQuery,
      profitQuery,
    ]);

    // cari detail barang terlaris
    const barangIds = topBarangData.map((item) => item.barangId);

    const barangDetails = await prisma.barang.findMany({
      where: { id: { in: barangIds } },
      select: { id: true, nama: true, kategori: { select: { nama: true } } },
    });

    const barangTerlaris = topBarangData.map((data) => {
      const detail = barangDetails.find((d) => d.id === data.barangId);
      return {
        barangId: data.barangId,
        totalTerjual: data._sum.jumlah,
        nama: detail?.nama,
        kategori: detail?.kategori?.nama || "N/A",
      };
    });

    // hitung profit hari ini
    const profitHariIni = profitDetails.reduce((total, item) => {
      const profitPerItem = item.barang.hargaJual - item.barang.hargaBeli;
      return total + profitPerItem * item.jumlah;
    }, 0);

    const dashboardData = {
      omsetHariIni: omsetHariIni._sum.total || 0,
      jumlahTransaksiHariIni: omsetHariIni._count.id || 0,
      profitHariIni: profitHariIni,
      barangMenipis,
      barangTerlaris,
      transaksiTerakhir,
    };

    return NextResponse.json(
      { dashboardData, message: "Berhasil mengambil data dashboard" },
      { status: 200 }
    );
  } catch (error) {
    console.log("error get dashboard data", error);
    return NextResponse.json(
      { message: "Terjadi Kesalahan Server!" },
      { status: 500 }
    );
  }
};
