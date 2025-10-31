"use client";

import Breadcrumb from "@/components/Breadcrumb";
import InfoDashboard from "@/components/InfoDashboard";
import TabelBarangJasaTerlaris from "@/components/TabelBarangJasaTerlaris";
import TabelTransaksiTerakhir from "@/components/TabelTransaksiTerakhir";
import TabelStokMenipis from "@/components/TableStokMenipis";
import { useToaster } from "@/providers/ToasterProvider";
import { useEffect } from "react";

const DashboardClient = ({ initialData, error }) => {
  const toaster = useToaster();

  useEffect(() => {
    // Jika ada error
    if (error) {
      toaster.current?.show({
        title: "Error",
        message: error,
        status: "error",
        duration: 5000,
        position: "top-center",
      });
    }
  }, [toaster, error]);

  if (error || !initialData) {
    return (
      <div>
        <Breadcrumb />
        <div className="mt-8 p-4 border rounded-sm bg-red-50 text-red-700">
          <h3 className="font-bold">Gagal memuat data dashboard.</h3>
          <p>{error || "Terjadi kesalahan tidak diketahui."}</p>
        </div>
      </div>
    );
  }

  const infoData = {
    omset: initialData?.omsetHariIni || 0,
    profit: initialData?.profitHariIni || 0,
    transaksi: initialData?.jumlahTransaksiHariIni || 0,
  };

  return (
    <div>
      <Breadcrumb />

      <InfoDashboard infoData={infoData} />

      {/* Stok Barang Menipis */}
      <div className="mt-8">
        <h3 className="font-semibold text-sm mb-2">Stok Barang Menipis</h3>
        <TabelStokMenipis stokMenipis={initialData.barangMenipis} />
      </div>

      {/* Barang dan Jasa Terlaris */}
      <div className="mt-8">
        <h3 className="font-semibold text-sm mb-2">Barang dan Jasa Terlaris</h3>
        <TabelBarangJasaTerlaris barangTerlaris={initialData.barangTerlaris} />
      </div>

      {/* transaksi terakhir */}
      <div className="mt-8">
        <h3 className="font-semibold text-sm mb-2">Transaksi Terakhir</h3>
        <TabelTransaksiTerakhir
          transaksiTerakhir={initialData.transaksiTerakhir}
        />
      </div>
    </div>
  );
};

export default DashboardClient;
