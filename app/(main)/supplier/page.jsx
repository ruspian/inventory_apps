"use client";

import Breadcrumb from "@/components/Breadcrumb";
import TabelPemasok from "@/components/TabelPemasok";
import TambahSupplier from "@/components/TambahSupplier";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getSupplier } from "@/lib/data";
import { useToaster } from "@/providers/ToasterProvider";
import React, { useCallback, useEffect, useState } from "react";
import { MdOutlineAddBox } from "react-icons/md";

const SupplierPage = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [dataSupplier, setDataSupplier] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const toaster = useToaster();

  const fetchSupplier = useCallback(async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }, [toaster]);

  useEffect(() => {
    fetchSupplier();
  }, [fetchSupplier]);

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
