import Breadcrumb from "@/components/Breadcrumb";
import InfoDashboard from "@/components/InfoDashboard";
import TabelBarangJasaTerlaris from "@/components/TabelBarangJasaTerlaris";
import TabelTransaksiTerakhir from "@/components/TabelTransaksiTerakhir";
import TabelStokMenipis from "@/components/TableStokMenipis";
import React from "react";

const DashboardPage = () => {
  return (
    <div>
      <Breadcrumb />

      <InfoDashboard />

      {/* Stok Barang Menipis */}
      <div className="mt-8">
        <h3 className="font-semibold text-sm mb-2">Stok Barang Menipis</h3>
        <TabelStokMenipis />
      </div>

      {/* Barang dan Jasa Terlaris */}
      <div className="mt-8">
        <h3 className="font-semibold text-sm mb-2">Barang dan Jasa Terlaris</h3>
        <TabelBarangJasaTerlaris />
      </div>

      {/* transaksi terakhir */}
      <div className="mt-8">
        <h3 className="font-semibold text-sm mb-2">Transaksi Terakhir</h3>
        <TabelTransaksiTerakhir />
      </div>
    </div>
  );
};

export default DashboardPage;
