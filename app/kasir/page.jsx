"use client";

import Breadcrumb from "@/components/Breadcrumb";
import FormPembayaran from "@/components/FormPembayaran";
import SearchBarKasir from "@/components/SearchBarKasir";
import TabelKasir from "@/components/TabelKasir";
import { useToaster } from "@/providers/ToasterProvider";
import React, { useMemo, useState } from "react";

const KasirPage = () => {
  const [dataKeranjang, setDataKeranjang] = useState([]);
  const toaster = useToaster();

  const handleScanBarcode = async (kodeBarang) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/barang/scan?kode=${kodeBarang}`
      );

      if (!response.ok) {
        const errorData = await response.json();

        toaster.current?.show({
          title: "Kesalahan!",
          description: errorData.message,
          status: "error",
          duration: 5000,
          position: "top-center",
        });
        return;
      }

      const barang = await response.json();

      // tambahkan barang ke keranjang
      setDataKeranjang((keranjangSekarang) => {
        // Cek apakah barang sudah ada di keranjang
        const barangSudahAda = keranjangSekarang.find(
          (item) => item.id === barang.id
        );

        if (barangSudahAda) {
          // Jika SUDAH ADA: Buat array baru, cari barangnya, dan tambahkan jumlahnya
          return keranjangSekarang.map((item) =>
            item.id === barang.id
              ? { ...item, jumlah: (item.jumlah || 1) + 1 }
              : item
          );
        } else {
          // Jika BELUM ADA: Tambahkan barang baru ke keranjang dengan jumlah 1
          return [...keranjangSekarang, { ...barang, jumlah: 1 }];
        }
      });
    } catch (error) {
      toaster.current?.show({
        title: "Kesalahan!",
        description: "Gagal memindai kode barang.",
        status: "error",
        duration: 5000,
        position: "top-center",
      });
    }
  };

  // fungsi untuk mengupdate jumlah barang di keranjang
  const updateJumlah = (barangId, jumlahBaru) => {
    if (jumlahBaru < 1) return;
    setDataKeranjang((keranjangSekarang) =>
      keranjangSekarang.map((item) =>
        item.id === barangId ? { ...item, jumlah: jumlahBaru } : item
      )
    );
  };

  // fungsi untuk hapus barang dari keranjang
  const hapusBarang = (barangId) => {
    setDataKeranjang((keranjangSekarang) =>
      keranjangSekarang.filter((item) => item.id !== barangId)
    );
  };

  // hitung total harga untuk pembayaran
  const totalHarga = useMemo(() => {
    return dataKeranjang.reduce((total, item) => {
      return total + item.hargaJual * item.jumlah;
    }, 0); // Mulai dari 0
  }, [dataKeranjang]);

  return (
    <div>
      <Breadcrumb />

      {/* pencarian */}
      <div className="">
        <SearchBarKasir handleScanBarcode={handleScanBarcode} />
      </div>

      <div className="mt-8">
        <h3 className="font-semibold text-sm mb-2">Keranjang</h3>
        <TabelKasir
          dataKeranjang={dataKeranjang}
          updateJumlah={updateJumlah}
          hapusBarang={hapusBarang}
        />
      </div>

      <div className="mt-8">
        <h3 className="font-semibold text-sm mb-2">Pembayaran</h3>
        <FormPembayaran
          totalHarga={totalHarga}
          dataKeranjang={dataKeranjang}
          setDataKeranjang={setDataKeranjang}
        />
      </div>
    </div>
  );
};

export default KasirPage;
