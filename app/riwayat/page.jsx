"use client";

import Breadcrumb from "@/components/Breadcrumb";
import TabelRiwayatStok from "@/components/TabelRiwayatStok";
import TambahStokMasuk from "@/components/TambahStokMasuk";
import { getBarang, getRiwayat, getSupplier } from "@/lib/data";
import { useToaster } from "@/providers/ToasterProvider";
import React, { useEffect, useState } from "react";

const RiwayatStokPage = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [dataRiwayatStok, setDataRiwayatStok] = useState([]);
  const [dataBarang, setDataBarang] = useState([]);
  const [dataSupplier, setDataSupplier] = useState([]);

  const toaster = useToaster();

  const fetchStokMasuk = async () => {
    try {
      const [riwayatStok, barang, supplier] = await Promise.all([
        getRiwayat(),
        getBarang(),
        getSupplier(),
      ]);

      setDataRiwayatStok(riwayatStok);
      setDataBarang(barang);
      setDataSupplier(supplier);
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
    fetchStokMasuk();
  }, [toaster]);
  return (
    <div>
      <Breadcrumb />

      <div className="my-8">
        <TabelRiwayatStok
          dataRiwayatStok={dataRiwayatStok}
          openEdit={openEdit}
          setOpenEdit={setOpenEdit}
          toaster={toaster}
          onSuccess={fetchStokMasuk}
          dataBarang={dataBarang}
          dataSupplier={dataSupplier}
        />
      </div>

      {openAdd && (
        <TambahStokMasuk
          toaster={toaster}
          onSuccess={fetchStokMasuk}
          open={openAdd}
          setOpen={setOpenAdd}
          dataBarang={dataBarang}
          dataSupplier={dataSupplier}
        />
      )}
    </div>
  );
};

export default RiwayatStokPage;
