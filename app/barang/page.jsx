"use client";

import Breadcrumb from "@/components/Breadcrumb";
import EditDataBarang from "@/components/EditDataBarang";
import TabelBarang from "@/components/TabelBarang";
import TambahDataBarang from "@/components/TambahDataBarang";
import { Button } from "@/components/ui/button";
import { getBarang, getKategori } from "@/lib/data";
import { useToaster } from "@/providers/ToasterProvider";
import React, { useEffect, useState } from "react";
import { MdModeEdit, MdOutlineAddBox } from "react-icons/md";

const DataBarangPage = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [kategoriData, setKategoriData] = useState([]);
  const [dataBarang, setDataBarang] = useState([]);

  const toaster = useToaster();

  const fetchData = async () => {
    try {
      const [kategoryResponse, barangResponse] = await Promise.all([
        getKategori(),
        getBarang(),
      ]);

      setKategoriData(kategoryResponse);
      setDataBarang(barangResponse);
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

      <div className="flex items-center justify-between w-full mt-8">
        <div className="relative flex items-start px-4 mb-4 gap-4">
          <Button
            className={`flex gap-2 items-center text-white text-sm rounded-sm px-4 py-2 cursor-pointer bg-emerald-500 hover:bg-emerald-600`}
            onClick={() => setOpenAdd(!openAdd)}
          >
            <MdOutlineAddBox className="size-5" />
            <span className="text-sm font-normal">Tambah Barang</span>
          </Button>
        </div>
      </div>

      <div className="">
        <TabelBarang
          dataBarang={dataBarang}
          openEdit={openEdit}
          setOpenEdit={setOpenEdit}
          openDelete={openDelete}
          setOpenDelete={setOpenDelete}
          icon={<MdModeEdit className="size-4" />}
          kategoriData={kategoriData}
          toaster={toaster}
          onSuccess={fetchData}
        />
      </div>

      {openAdd && (
        <TambahDataBarang
          open={openAdd}
          setOpen={setOpenAdd}
          kategoriData={kategoriData}
          toaster={toaster}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
};

export default DataBarangPage;
