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
