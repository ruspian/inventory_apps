"use client";

import Breadcrumb from "@/components/Breadcrumb";
import TabelKategori from "@/components/TabelKategori";
import TambahKategori from "@/components/TambahKategori";
import { Button } from "@/components/ui/button";
import { getKategori } from "@/lib/data";
import { useToaster } from "@/providers/ToasterProvider";
import React, { useEffect, useState } from "react";
import { MdOutlineAddBox } from "react-icons/md";

const KategoriPage = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [dataKategori, setDataKategori] = useState([]);

  const toaster = useToaster();

  const fetchKategori = async () => {
    try {
      const categories = await getKategori();

      setDataKategori(categories);
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
    fetchKategori();
  }, [toaster]);

  return (
    <div>
      <Breadcrumb />

      {/* tombol tambah kategori */}
      <div className="flex items-center justify-between w-full mt-8">
        <div className="relative flex items-start px-4 mb-4 gap-4">
          <Button
            className={`flex gap-2 items-center text-white text-sm rounded-sm px-4 py-2 cursor-pointer bg-emerald-500 hover:bg-emerald-600`}
            onClick={() => setOpenAdd(!openAdd)}
          >
            <MdOutlineAddBox className="size-5" />
            <span className="text-sm font-normal">Tambah Kategori</span>
          </Button>
        </div>
      </div>

      <div className="">
        <TabelKategori
          dataKategori={dataKategori}
          openEdit={openEdit}
          setOpenEdit={setOpenEdit}
          openDelete={openDelete}
          setOpenDelete={setOpenDelete}
          toaster={toaster}
          onSuccess={fetchKategori}
        />
      </div>

      {openAdd && (
        <TambahKategori
          toaster={toaster}
          onSuccess={fetchKategori}
          open={openAdd}
          setOpen={setOpenAdd}
        />
      )}
    </div>
  );
};

export default KategoriPage;
