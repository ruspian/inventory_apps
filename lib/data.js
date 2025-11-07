import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET KATEGORI DENGAN SEARCH & PAGINATION
export const getKategori = async (search, page, limit) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/kategori?search=${search}&page=${page}&limit=${limit}`,
      {
        method: "GET",
        next: { revalidate: 120 }, // ambil ulang kategori setiap 2 menit
      }
    );

    if (!response.ok) {
      throw new Error("Terjadi kesalahan, silahkan coba lagi!");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error("Terjadi kesalahan pada server!");
  }
};

// GET KATEGORI SEMUA
export const getSemuaKategori = async () => {
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

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error("Terjadi kesalahan pada server!");
  }
};

// GET DATA BARANG
export const getBarang = async (search = "", page = 1, limit = 10) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/barang?search=${search}&page=${page}&limit=${limit}`,
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

export const getSemuaBarang = async () => {
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

    const result = await response.json();
    return result.data;
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

// GET DATA RIWAYAT MASUK DENGAN FILTER DAN PAGINATION
export const getRiwayatMasuk = async (filter, page, limit) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/riwayat/masuk?filter=${filter}&page=${page}&limit=${limit}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    if (!response.ok) throw new Error("Gagal fetch riwayat masuk");
    return await response.json();
  } catch (error) {
    throw new Error("Gagal mengambil data riwayat stok masuk!");
  }
};

// GET DATA RIWAYAT MASUK UNTUK EKSPOR PDF
export const getRiwayatMasukForExport = async (filter) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/riwayat/masuk?filter=${filter}&export=true`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    if (!response.ok) throw new Error("Gagal mengambil data ekspor");
    const result = await response.json();
    return result.data;
  } catch (error) {
    throw new Error("Terjadi kesalahan pada server!");
  }
};

// GET DATA RIWAYAT MASUK DENGAN FILTER DAN PAGINATION
export const getRiwayatOpname = async (filter, page, limit) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/opname?filter=${filter}&page=${page}&limit=${limit}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    if (!response.ok) throw new Error("Gagal fetch riwayat opname");
    return await response.json();
  } catch (error) {
    throw new Error("Gagal mengambil data riwayat stok opname!");
  }
};

// GET DATA RIWAYAT MASUK UNTUK EKSPOR PDF
export const getRiwayatOpnameForExport = async (filter) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/opname?filter=${filter}&export=true`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    if (!response.ok) throw new Error("Gagal mengambil data ekspor");
    const result = await response.json();
    return result.data;
  } catch (error) {
    throw new Error("Terjadi kesalahan pada server!");
  }
};

// GET DATA LAPORAN PENJUALAN DENGAN PAGINATION DAN FILTER
export const getLaporanPenjualan = async (filter, page, limit) => {
  try {
    // Tambahkan filter sebagai query parameter
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/penjualan?filter=${filter}&page=${page}&limit=${limit}`,
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

// GET DATA LAPORAN PENJUALAN UNTUK EXPORT PDF
export const getLaporanPenjualanForExport = async (filter) => {
  try {
    // Tambahkan filter sebagai query parameter
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/penjualan?filter=${filter}&export=true`,
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

// GET DATA RIWAYAT STOK DENGAN PAGINATION DAN FILTER
export const getRiwayatStok = async (filter, page, limit) => {
  try {
    // Tambahkan filter sebagai query parameter
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/riwayat?filter=${filter}&page=${page}&limit=${limit}`,
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

// GET DATA RIWAYAT STOK UNTUK EXPORT PDF
export const getRiwayatStokForExport = async (filter) => {
  try {
    // Tambahkan filter sebagai query parameter
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/riwayat?filter=${filter}&export=true`,
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

  // 🔹 Rentang waktu: Bulan ini
  const now = new Date();
  const monthGte = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0); // awal bulan
  const monthLte = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  ); // akhir bulan
  const whereThisMonth = { createdAt: { gte: monthGte, lte: monthLte } };

  // Barang menipis
  const barangMenipisQuery = prisma.barang.findMany({
    where: { tipe: "BARANG", stok: { lte: 10 } },
    include: { kategori: true },
    orderBy: { stok: "asc" },
    take: 5,
  });

  // Barang terlaris
  const topBarangDataQuery = prisma.penjualanDetail.groupBy({
    by: ["barangId"],
    _sum: { jumlah: true },
    orderBy: { _sum: { jumlah: "desc" } },
    take: 5,
  });

  // Transaksi terakhir
  const transaksiTerakhirQuery = prisma.penjualan.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { detail: { include: { barang: true } } },
  });

  // Omset bulan ini
  const omsetQuery = prisma.penjualan.aggregate({
    where: whereThisMonth,
    _sum: { total: true },
    _count: { id: true },
  });

  // Profit bulan ini
  const profitQuery = prisma.penjualanDetail.findMany({
    where: {
      penjualan: { createdAt: { gte: monthGte, lte: monthLte } },
      barang: { tipe: "BARANG" },
    },
    include: {
      barang: { select: { hargaBeli: true, hargaJual: true } },
    },
  });

  // Jalankan semua query secara paralel
  const [
    barangMenipis,
    topBarangData,
    transaksiTerakhir,
    omsetBulanIni,
    profitDetails,
  ] = await Promise.all([
    barangMenipisQuery,
    topBarangDataQuery,
    transaksiTerakhirQuery,
    omsetQuery,
    profitQuery,
  ]);

  // Cari detail barang terlaris
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

  // Hitung total profit bulan ini
  const profitBulanIni = profitDetails.reduce((total, item) => {
    const profitPerItem = item.barang.hargaJual - item.barang.hargaBeli;
    return total + profitPerItem * item.jumlah;
  }, 0);

  return {
    omsetBulanIni: omsetBulanIni._sum.total || 0,
    jumlahTransaksiBulanIni: omsetBulanIni._count.id || 0,
    profitBulanIni,
    barangMenipis,
    barangTerlaris,
    transaksiTerakhir,
  };
};
