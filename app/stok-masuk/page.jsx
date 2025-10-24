"use client";

import Breadcrumb from "@/components/Breadcrumb";
import TabelStokMasuk from "@/components/TabelStokMasuk";
import TambahStokMasuk from "@/components/TambahStokMasuk";
import { Button } from "@/components/ui/button";
import { getBarang, getRiwayat, getSupplier } from "@/lib/data";
import { useToaster } from "@/providers/ToasterProvider";
import React, { useEffect, useState } from "react";
import { MdOutlineAddBox } from "react-icons/md";

const StokMasukPage = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [dataStokMasuk, setDataStokMasuk] = useState([]);
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

      //   ambil tipe masuk dari riwayat
      const stokMasuk = riwayatStok.filter((item) => item.tipe === "MASUK");

      setDataStokMasuk(stokMasuk);
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

      {/* tambah stok barang masuk */}
      <div className="flex items-center justify-between w-full mt-8">
        <div className="relative flex items-start px-4 mb-4 gap-4">
          <Button
            className={`flex gap-2 items-center text-white text-sm rounded-sm px-4 py-2 cursor-pointer bg-emerald-500 hover:bg-emerald-600`}
            onClick={() => setOpenAdd(!openAdd)}
          >
            <MdOutlineAddBox className="size-5" />
            <span className="text-sm font-normal">Buat Stok Masuk</span>
          </Button>
        </div>
      </div>

      <div className="">
        <TabelStokMasuk
          dataStokMasuk={dataStokMasuk}
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

export default StokMasukPage;
