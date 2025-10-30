"use client";

import Breadcrumb from "@/components/Breadcrumb";
import Pagination from "@/components/Pagination";
import TabelKategori from "@/components/TabelKategori";
import TambahKategori from "@/components/TambahKategori";
import { Button } from "@/components/ui/button";
import { getKategori } from "@/lib/data";
import { useToaster } from "@/providers/ToasterProvider";
import React, { useCallback, useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { MdOutlineAddBox } from "react-icons/md";
import { useDebounce } from "use-debounce";

const ITEM_PER_HALAMAN = 10;

const KategoriPage = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [dataKategori, setDataKategori] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce => Jangan cari sampai user berhenti ngetik 500ms
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  const toaster = useToaster();

  const fetchKategori = useCallback(async () => {
    try {
      setIsLoading(true);

      const categories = await getKategori(
        debouncedSearch,
        currentPage,
        ITEM_PER_HALAMAN
      );

      setDataKategori(categories.data);
      setTotalCount(categories.totalCount);
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
  }, [debouncedSearch, currentPage, toaster]);

  useEffect(() => {
    fetchKategori();
  }, [fetchKategori]);

  const totalPages = Math.ceil(totalCount / ITEM_PER_HALAMAN);

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

        {/* cari kategori */}
        <div className="relative">
          <input
            type="text"
            placeholder="Nama Kategori"
            className="border p-2 pr-8 rounded-sm w-full"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset ke halaman 1 setiap kali ngetik
            }}
          />
          <IoSearchOutline className="size-5 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
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

        {dataKategori.length > 0 && (
          <Pagination
            totalCount={totalCount}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            totalPages={totalPages}
            isLoading={isLoading}
          />
        )}
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
