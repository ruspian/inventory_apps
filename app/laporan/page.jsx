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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const toaster = useToaster();

  const onSubmit = (data) => {
    console.log("data", data);
  };

  const fetchPenjualan = async () => {
    try {
      const laporanPenjualan = await getLaporanPenjualan();
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
    fetchPenjualan();
  }, [toaster]);

  return (
    <div>
      <Breadcrumb />

      <div className="w-full flex justify-start my-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-2 border border-neutral-300 rounded-sm"
        >
          <select {...register("filter")}>
            <option value="harian">Hari Ini</option>
            <option value="mingguan">Minggu Ini</option>
            <option value="bulanan">Bulan Ini</option>
            <option value="tahunan">Tahun Ini</option>
          </select>
        </form>
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
