"use client";

import Breadcrumb from "@/components/Breadcrumb";
import InfoDashboard from "@/components/InfoDashboard";
import TabelBarangJasaTerlaris from "@/components/TabelBarangJasaTerlaris";
import TabelTransaksiTerakhir from "@/components/TabelTransaksiTerakhir";
import TabelStokMenipis from "@/components/TableStokMenipis";
import { getDataDastboard } from "@/lib/data";
import { useToaster } from "@/providers/ToasterProvider";
import { useEffect, useState } from "react";

const DashboardPage = () => {
  const [barangMenipis, setBarangMenipis] = useState([]);
  const [barangTerlaris, setBarangTerlaris] = useState([]);
  const [transaksiTerakhir, setTransaksiTerakhir] = useState([]);
  const [profitHariIni, setProfitHariIni] = useState(0);
  const [omsetHariIni, setOmsetHariIni] = useState(0);
  const [jumlahTransaksiHariIni, setJumlahTransaksiHariIni] = useState(0);

  const toaster = useToaster();

  const fetchData = async () => {
    try {
      const dashboard = await getDataDastboard();

      setBarangMenipis(dashboard.dashboardData.barangMenipis);
      setBarangTerlaris(dashboard.dashboardData.barangTerlaris);
      setTransaksiTerakhir(dashboard.dashboardData.transaksiTerakhir);
      setProfitHariIni(dashboard.dashboardData.profitHariIni);
      setOmsetHariIni(dashboard.dashboardData.omsetHariIni);
      setJumlahTransaksiHariIni(dashboard.dashboardData.jumlahTransaksiHariIni);
    } catch (error) {
      toaster.current?.show({
        title: "Error",
        message: error.message,
        variant: "error",
        duration: 5000,
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [toaster]);

  return (
    <div>
      <Breadcrumb />

      <InfoDashboard
        omset={omsetHariIni}
        profit={profitHariIni}
        transaksi={jumlahTransaksiHariIni}
      />

      {/* Stok Barang Menipis */}
      <div className="mt-8">
        <h3 className="font-semibold text-sm mb-2">Stok Barang Menipis</h3>
        <TabelStokMenipis stokMenipis={barangMenipis} />
      </div>

      {/* Barang dan Jasa Terlaris */}
      <div className="mt-8">
        <h3 className="font-semibold text-sm mb-2">Barang dan Jasa Terlaris</h3>
        <TabelBarangJasaTerlaris barangTerlaris={barangTerlaris} />
      </div>

      {/* transaksi terakhir */}
      <div className="mt-8">
        <h3 className="font-semibold text-sm mb-2">Transaksi Terakhir</h3>
        <TabelTransaksiTerakhir transaksiTerakhir={transaksiTerakhir} />
      </div>
    </div>
  );
};

export default DashboardPage;
