"use client";

import { useToaster } from "@/providers/ToasterProvider";
import React, { useState, useEffect } from "react";

export default function FormPembayaran({
  totalHarga,
  dataKeranjang,
  setDataKeranjang,
}) {
  const [uangDibayar, setUangDibayar] = useState(0);
  const [kembalian, setKembalian] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const toaster = useToaster();

  // Hitung kembalian setiap kali uangDibayar atau totalHarga berubah
  useEffect(() => {
    const dibayar = Number(uangDibayar) || 0;
    const kembali = dibayar - totalHarga;
    setKembalian(kembali < 0 ? 0 : kembali); // Jangan tampilkan kembalian negatif
  }, [uangDibayar, totalHarga]);

  // Fungsi untuk menangani submit pembayaran
  const handleBayar = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // pastikan ada barang di keranjang
    if (dataKeranjang.length === 0) {
      toaster.current?.show({
        title: "Error",
        message: "Keranjang kosong!",
        status: "error",
        duration: 5000,
        position: "top-center",
      });
      setIsLoading(false);
      return;
    }

    // jika uang dibayar kurang dari total harga
    if (Number(uangDibayar) < totalHarga) {
      toaster.current?.show({
        title: "Error",
        message: "Uang tunai kurang!",
        status: "error",
        duration: 5000,
        position: "top-center",
      });
      setIsLoading(false);
      return;
    }

    // Siapkan data untuk dikirim ke API
    const dataTransaksi = {
      total: totalHarga,
      dibayar: Number(uangDibayar),
      kembalian: kembalian,
      items: dataKeranjang.map((item) => ({
        barangId: item.id,
        jumlah: item.jumlah,
        hargaSatuan: item.hargaJual,
        subTotal: item.hargaJual * item.jumlah,
        tipe: item.tipe,
      })),
    };

    // Panggil API Penjualan
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/penjualan`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataTransaksi),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal menyimpan transaksi");
      }

      // jika Sukses!
      toaster.current?.show({
        title: "Sukses",
        message: "Transaksi berhasil disimpan!",
        status: "success",
        duration: 5000,
        position: "top-center",
      });

      // Kosongkan keranjang di KasirPage
      setDataKeranjang([]);
      setUangDibayar(0); // Reset form ini
    } catch (error) {
      toaster.current?.show({
        title: "Error",
        message: error.message || "Terjadi kesalahan, silahkan coba lagi!",
        status: "error",
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="p-4 border rounded-sm" onSubmit={handleBayar}>
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-medium">Total Belanja:</span>
        <span className="text-2xl font-bold text-emerald-500">
          Rp {totalHarga.toLocaleString("id-ID")}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="uangDibayar">Uang Tunai Diterima</label>
        <input
          id="uangDibayar"
          type="number"
          value={uangDibayar || ""}
          onChange={(e) => setUangDibayar(e.target.value)}
          className="border p-2 rounded"
          placeholder="Masukkan jumlah uang..."
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-between items-center mt-2">
        <span className="text-md">Kembalian:</span>
        <span className="text-lg font-medium">
          Rp {kembalian.toLocaleString("id-ID")}
        </span>
      </div>

      <button
        type="submit"
        className="w-full bg-emerald-500 text-white p-3 rounded mt-6 font-bold disabled:bg-neutral-400"
        disabled={isLoading || totalHarga === 0}
      >
        {isLoading ? "Memproses..." : "Selesaikan Transaksi"}
      </button>
    </form>
  );
}
