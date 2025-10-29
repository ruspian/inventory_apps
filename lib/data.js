import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET KATEGORI
export const getKategori = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/kategori`,
      {
        method: "GET",
        next: { revalidate: 120 }, // ambil ulang kategori setiap 2 menit
      }
    );

    if (!response.ok) {
      throw new Error("Terjadi kesalahan, silahkan coba lagi!");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Terjadi kesalahan pada server!");
  }
};

// GET DATA BARANG
export const getBarang = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/barang`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Terjadi kesalahan, silahkan coba lagi!");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Terjadi kesalahan pada server!");
  }
};

// GET DATA SUPPLIER
export const getSupplier = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/supplier`,
      {
        method: "GET",
        next: { revalidate: 3600 }, // ambil ulang supplier setiap 1 jam
      }
    );

    if (!response.ok) {
      throw new Error("Terjadi kesalahan, silahkan coba lagi!");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Terjadi kesalahan pada server!");
  }
};

// GET DATA RIWAYAT STOK
export const getRiwayat = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/riwayat`,
      {
        method: "GET",
        next: { revalidate: 120 }, // ambil ulang stok masuk setiap 2 menit
      }
    );

    if (!response.ok) {
      throw new Error("Terjadi kesalahan, silahkan coba lagi!");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Terjadi kesalahan pada server!");
  }
};

// GET DATA LAPORAN PENJUALAN
export const getLaporanPenjualan = async (filter) => {
  try {
    // Tambahkan filter sebagai query parameter
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/penjualan?filter=${filter}`,
      {
        method: "GET",
        cache: "no-store", // Laporan harus selalu baru
      }
    );

    if (!response.ok) {
      throw new Error("Terjadi kesalahan, silahkan coba lagi!");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Terjadi kesalahan pada server!");
  }
};

// AMBIL DATA DASHBOARD SERVER SIDE
export const getDashboardServerData = async (req) => {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Anda tidak memiliki akses!");
  }

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

  return {
    omsetHariIni: omsetHariIni._sum.total || 0,
    jumlahTransaksiHariIni: omsetHariIni._count.id || 0,
    profitHariIni: profitHariIni,
    barangMenipis,
    barangTerlaris,
    transaksiTerakhir,
  };
};
