"use client";

import Breadcrumb from "@/components/Breadcrumb";
import Pagination from "@/components/Pagination";
import TabelLaporanPenjualan from "@/components/TabelLaporanPenjualan";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getLaporanPenjualan, getLaporanPenjualanForExport } from "@/lib/data";
import { tanggal } from "@/lib/tanggal";
import { useToaster } from "@/providers/ToasterProvider";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import React, { useCallback, useEffect, useState } from "react";
import { FaRegFilePdf } from "react-icons/fa6";

const ITEM_PER_HALAMAN = 10;

const LaporanPage = () => {
  const [dataLaporanPenjualan, setDataLaporanPenjualan] = useState([]);
  const [openDetail, setOpenDetail] = useState(false);
  const [idPenjualan, setIdPenjualan] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  // state untuk search dan pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  const [isExporting, setIsExporting] = useState(false);

  const totalPages = Math.ceil(totalCount / ITEM_PER_HALAMAN);

  const toaster = useToaster();

  const fetchPenjualan = useCallback(async () => {
    try {
      setIsLoading(true);

      // Kirim filter ke fungsi getLaporanPenjualan
      const laporanPenjualan = await getLaporanPenjualan(
        filter,
        currentPage,
        ITEM_PER_HALAMAN
      );

      setDataLaporanPenjualan(laporanPenjualan.data);
      setTotalCount(laporanPenjualan.totalCount);
    } catch (error) {
      toaster.current.show({
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
    fetchPenjualan();
  }, [fetchPenjualan]);

  // fungsi untuk export PDF
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
      const data = await getLaporanPenjualanForExport(filter);

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
        "ID Struk",
        "Barang yang Dibeli",
        "Total Belanja",
        "Dibayar",
        "Kembalian",
        "Catatan",
      ];

      const dataLaporan = Array.isArray(data) ? data : data.data;

      // isi data di body
      const tableBody = dataLaporan.map((item, index) => {
        const barangString = item.detail
          .map((detailItem) => {
            return `${detailItem.barang.nama} (${
              detailItem.jumlah
            } x ${detailItem.hargaSatuan.toLocaleString("id-ID")})`;
          })
          .join("\n");

        // Kembalikan result
        return [
          index + 1,
          tanggal(item.createdAt),
          item.id,
          barangString,
          item.total,
          item.dibayar,
          item.kembalian,
          item.catatan || "N/A",
        ];
      });

      const filterText = filter.charAt(0).toUpperCase() + filter.slice(1); // ubah awal huruf ke huruf besar

      // Ambil lebar halaman (otomatis jadi 330mm)
      const pageWidth = doc.internal.pageSize.getWidth();
      // Tentukan titik tengah
      const pageCenter = pageWidth / 2;

      // Tambahkan Judul ke PDF
      doc.setFontSize(18);
      doc.text("LAPORAN PENJUALAN", pageCenter, 20, { align: "center" });

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

  if (isLoading) {
    return (
      <div className="p-4">
        {/*  Skeleton untuk Breadcrumb */}
        <Skeleton className="h-6 w-1/3 rounded-sm" />

        {/* skeleton tombol dan pencarian */}
        <div className="flex justify-between items-center w-full mt-8 mb-4">
          {/* Tombol */}
          <div className="flex gap-4">
            <Skeleton className="h-10 w-36 rounded-sm" />
            <Skeleton className="h-10 w-32 rounded-sm" />
          </div>

          {/* pencarian */}
          <Skeleton className="h-10 w-64 rounded-sm" />
        </div>

        {/* Skeleton untuk Tabel */}
        <Skeleton className="h-96 w-full rounded-xl" />

        {/*  Skeleton untuk Pagination */}
        <div className="flex justify-between items-center mt-4">
          {/* Info Total Data */}
          <Skeleton className="h-4 w-1/4 rounded-sm" />

          {/* Tombol Prev/Next */}
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24 rounded-sm" />
            <Skeleton className="h-10 w-24 rounded-sm" />
          </div>
        </div>
      </div>
    );
  }

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

      <div className="">
        <TabelLaporanPenjualan
          dataLaporanPenjualan={dataLaporanPenjualan}
          openDetail={openDetail}
          setOpenDetail={setOpenDetail}
          idPenjualan={idPenjualan}
          setIdPenjualan={setIdPenjualan}
        />

        {dataLaporanPenjualan.length > 0 && (
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

export default LaporanPage;
