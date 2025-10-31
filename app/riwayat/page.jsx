"use client";

import Breadcrumb from "@/components/Breadcrumb";
import Pagination from "@/components/Pagination";
import TabelRiwayatStok from "@/components/TabelRiwayatStok";
import { Button } from "@/components/ui/button";
import { getRiwayatStok, getRiwayatStokForExport } from "@/lib/data";
import { useToaster } from "@/providers/ToasterProvider";
import React, { useCallback, useEffect, useState } from "react";
import { FaRegFilePdf } from "react-icons/fa6";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { tanggal } from "@/lib/tanggal";

const ITEM_PER_HALAMAN = 10;

const RiwayatStokPage = () => {
  const [dataRiwayatStok, setDataRiwayatStok] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  // state untuk search dan pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  const [isExporting, setIsExporting] = useState(false);

  const totalPages = Math.ceil(totalCount / ITEM_PER_HALAMAN);

  const toaster = useToaster();

  const fetchRiwayat = useCallback(async () => {
    try {
      setIsLoading(true);

      const stokMasuk = await getRiwayatStok(
        filter,
        currentPage,
        ITEM_PER_HALAMAN
      );

      setDataRiwayatStok(stokMasuk.data);
      setTotalCount(stokMasuk.totalCount);
    } catch (error) {
      toaster.current?.show({
        title: "Error",
        message: error.message,
        variant: "error",
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  }, [filter, currentPage, toaster]);

  useEffect(() => {
    fetchRiwayat();
  }, [fetchRiwayat]);

  const handleExportPDF = async () => {
    setIsExporting(true); // loading

    // tampilkan toast
    toaster.current?.show({
      title: "Info",
      message: "Mempersiapkan PDF...",
      duration: 5000,
      position: "top-center",
      variant: "default",
    });
    try {
      //  panggil API dengan filter
      const data = await getRiwayatStokForExport(filter);

      // cek apakah data kosong
      if (data.length === 0) {
        toaster.current?.show({
          title: "Info",
          message: "Tidak ada data untuk diekspor.",
          duration: 5000,
          position: "top-center",
          variant: "info",
        });
        setIsExporting(false);
        return;
      }

      // Siapkan dokumen PDF
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [210, 330],
      });

      // Siapkan data untuk header tabel
      const tableHeaders = [
        "No",
        "Tanggal",
        "Nama Barang",
        "Pemasok",
        "Jumlah",
        "Stok Sebelum",
        "Stok Sesudah",
        "Dicatat Oleh",
        "Tipe",
        "Catatan",
      ];

      // isi data di body
      const tableBody = data.data.map((item, index) => [
        index + 1,
        tanggal(item.createdAt),
        item.barang.nama,
        item.supplier?.nama || "N/A",
        `${item.jumlah} ${item.barang.satuan}`,
        item.stokSebelum,
        item.stokSesudah,
        item.user.name,
        item.barang.tipe,
        item.catatan || "N/A",
      ]);

      const filterText = filter.charAt(0).toUpperCase() + filter.slice(1); // ubah awal huruf ke huruf besar

      // Ambil lebar halaman (otomatis jadi 330mm)
      const pageWidth = doc.internal.pageSize.getWidth();
      // Tentukan titik tengah
      const pageCenter = pageWidth / 2;

      // Tambahkan Judul ke PDF
      doc.setFontSize(18);
      doc.text("LAPORAN RIWAYAT STOK", pageCenter, 20, { align: "center" });

      // sub judul
      doc.setFontSize(10);
      doc.text(`Laporan: ${filterText || "Semua"}`, 14, 28);
      doc.text(`Tanggal Cetak: ${tanggal(new Date().toISOString())}`, 14, 32);

      // Buat tabelnya
      autoTable(doc, {
        startY: 40,
        head: [tableHeaders],
        body: tableBody,
      });

      // Simpan file PDF
      const namaFile = `Laporan ${filterText || "Semua"} Stok Masuk  - ${
        new Date().toISOString().split("T")[0]
      }).pdf`;
      doc.save(namaFile);
    } catch (error) {
      toaster.current?.show({
        title: "Error",
        message: error.message,
        variant: "error",
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setIsExporting(false);
    }
  };
  return (
    <div>
      <Breadcrumb />

      <div className="flex items-center justify-between w-full mt-8">
        <div className="relative flex items-start px-4 mb-4 gap-4">
          <Button
            className={`flex gap-2 items-center text-white text-sm rounded-sm px-4 py-2 cursor-pointer bg-red-500 hover:bg-red-600`}
            onClick={handleExportPDF}
            disabled={isExporting}
          >
            <FaRegFilePdf className="size-5" />
            <span className="text-sm font-normal">Ekspor PDF</span>
          </Button>
        </div>

        <div className="relative">
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1); // Reset halaman saat filter ganti
            }}
            className="border p-2 rounded-sm"
          >
            <option value="semua">Semua</option>
            <option value="harian">Hari Ini</option>
            <option value="mingguan">Minggu Ini</option>
            <option value="bulanan">Bulan Ini</option>
            <option value="tahunan">Tahun Ini</option>
          </select>
        </div>
      </div>

      <div className="my-2">
        <TabelRiwayatStok dataRiwayatStok={dataRiwayatStok} />

        {dataRiwayatStok.length > 0 && (
          <Pagination
            totalCount={totalCount}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            totalPages={totalPages}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default RiwayatStokPage;
