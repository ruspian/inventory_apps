"use client";

import Breadcrumb from "@/components/Breadcrumb";
import TabelLaporanPenjualan from "@/components/TabelLaporanPenjualan";
import { getLaporanPenjualan } from "@/lib/data";
import { useToaster } from "@/providers/ToasterProvider";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const LaporanPage = () => {
  const [dataLaporanPenjualan, setDataLaporanPenjualan] = useState([]);
  const [openDetail, setOpenDetail] = useState(false);
  const [idPenjualan, setIdPenjualan] = useState(null);

  const { register, watch } = useForm({
    defaultValues: {
      filter: "harian",
    },
  });

  // pantau nilai filter menggunakan watch dari react-hook-form
  const filterValue = watch("filter");

  const toaster = useToaster();

  const fetchPenjualan = async (filter) => {
    try {
      // Kirim filter ke fungsi getLaporanPenjualan
      const laporanPenjualan = await getLaporanPenjualan(filter);
      setDataLaporanPenjualan(laporanPenjualan);
    } catch (error) {
      toaster.current.show({
        title: "Error",
        message: error.message,
        variant: "error",
        duration: 5000,
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    // Panggil fetchPenjualan saat filterValue berubah
    if (filterValue) {
      fetchPenjualan(filterValue);
    }
  }, [filterValue, toaster]);

  return (
    <div>
      <Breadcrumb />

      <div className="w-[120px] flex justify-start my-6 p-2 border border-neutral-300 rounded-sm">
        <select {...register("filter")}>
          <option value="harian">Hari Ini</option>
          <option value="mingguan">Minggu Ini</option>
          <option value="bulanan">Bulan Ini</option>
          <option value="tahunan">Tahun Ini</option>
        </select>
      </div>

      <div className="">
        <TabelLaporanPenjualan
          dataLaporanPenjualan={dataLaporanPenjualan}
          openDetail={openDetail}
          setOpenDetail={setOpenDetail}
          idPenjualan={idPenjualan}
          setIdPenjualan={setIdPenjualan}
        />
      </div>
    </div>
  );
};

export default LaporanPage;
