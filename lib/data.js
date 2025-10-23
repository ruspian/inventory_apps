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
