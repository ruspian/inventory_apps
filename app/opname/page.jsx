"use client";

import Breadcrumb from "@/components/Breadcrumb";
import TabelOpname from "@/components/TabelOpname";
import TambahOpname from "@/components/TambahOpname";
import { Button } from "@/components/ui/button";
import { getBarang, getRiwayat } from "@/lib/data";
import { useToaster } from "@/providers/ToasterProvider";
import React, { useEffect, useState } from "react";
import { MdOutlineAddBox } from "react-icons/md";

const OpnamePage = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [dataStokOpname, setDataStokOpname] = useState([]);
  const [dataBarang, setDataBarang] = useState([]);

  const toaster = useToaster();

  const fetchData = async () => {
    try {
      const [riwayatStok, barang] = await Promise.all([
        getRiwayat(),
        getBarang(),
      ]);

      const stokOpname = riwayatStok.filter((item) => item.tipe === "OPNAME");

      setDataStokOpname(stokOpname);
      setDataBarang(barang);
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

      {/* tambah stok barang masuk */}
      <div className="flex items-center justify-between w-full mt-8">
        <div className="relative flex items-start px-4 mb-4 gap-4">
          <Button
            className={`flex gap-2 items-center text-white text-sm rounded-sm px-4 py-2 cursor-pointer bg-emerald-500 hover:bg-emerald-600`}
            onClick={() => setOpenAdd(!openAdd)}
          >
            <MdOutlineAddBox className="size-5" />
            <span className="text-sm font-normal">Opname Baru</span>
          </Button>
        </div>
      </div>

      <div className="">
        <TabelOpname
          dataStokOpname={dataStokOpname}
          openEdit={openEdit}
          setOpenEdit={setOpenEdit}
          toaster={toaster}
          onSuccess={fetchData}
          dataBarang={dataBarang}
        />
      </div>

      {openAdd && (
        <TambahOpname
          toaster={toaster}
          onSuccess={fetchData}
          open={openAdd}
          setOpen={setOpenAdd}
          dataBarang={dataBarang}
        />
      )}
    </div>
  );
};

export default OpnamePage;
