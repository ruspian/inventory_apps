"use client";

import Breadcrumb from "@/components/Breadcrumb";
import TabelPemasok from "@/components/TabelPemasok";
import TambahSupplier from "@/components/TambahSupplier";
import { Button } from "@/components/ui/button";
import { getSupplier } from "@/lib/data";
import { useToaster } from "@/providers/ToasterProvider";
import React, { useEffect, useState } from "react";
import { MdOutlineAddBox } from "react-icons/md";

const SupplierPage = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [dataSupplier, setDataSupplier] = useState([]);

  const toaster = useToaster();

  const fetchSupplier = async () => {
    try {
      const suppliers = await getSupplier();

      setDataSupplier(suppliers);
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
    fetchSupplier();
  }, [toaster]);
  return (
    <div>
      <Breadcrumb />

      {/* tombol tambah pemasok */}
      <div className="flex items-center justify-between w-full mt-8">
        <div className="relative flex items-start px-4 mb-4 gap-4">
          <Button
            className={`flex gap-2 items-center text-white text-sm rounded-sm px-4 py-2 cursor-pointer bg-emerald-500 hover:bg-emerald-600`}
            onClick={() => setOpenAdd(!openAdd)}
          >
            <MdOutlineAddBox className="size-5" />
            <span className="text-sm font-normal">Tambah Pemasok Baru</span>
          </Button>
        </div>
      </div>

      {/* tabel data pemasok */}
      <div className="">
        <TabelPemasok
          dataSupplier={dataSupplier}
          openEdit={openEdit}
          setOpenEdit={setOpenEdit}
          openDelete={openDelete}
          setOpenDelete={setOpenDelete}
          toaster={toaster}
          onSuccess={fetchSupplier}
        />
      </div>

      {openAdd && (
        <TambahSupplier
          toaster={toaster}
          onSuccess={fetchSupplier}
          open={openAdd}
          setOpen={setOpenAdd}
        />
      )}
    </div>
  );
};

export default SupplierPage;
