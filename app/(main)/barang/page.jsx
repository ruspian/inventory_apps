"use client";

import Pagination from "@/components/Pagination";
import Breadcrumb from "@/components/Breadcrumb";
import TabelBarang from "@/components/TabelBarang";
import TambahDataBarang from "@/components/TambahDataBarang";
import { Button } from "@/components/ui/button";
import { getBarang, getSemuaKategori } from "@/lib/data";
import { useToaster } from "@/providers/ToasterProvider";
import React, { useCallback, useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { MdModeEdit, MdOutlineAddBox } from "react-icons/md";
import { useDebounce } from "use-debounce";

const ITEM_PER_HALAMAN = 10; // Samakan dengan 'limit' di API

const DataBarangPage = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [kategoriData, setKategoriData] = useState([]);
  const [dataBarang, setDataBarang] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // state untuk search dan pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce => Jangan cari sampai user berhenti ngetik 500ms
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  const toaster = useToaster();

  // Fungsi ini hanya mengambil kategori
  const fetchKategori = async () => {
    try {
      const kategoryResponse = await getSemuaKategori();
      setKategoriData(kategoryResponse.data);
    } catch (error) {
      toaster.current?.show({
        title: "Error",
        message: "Gagal mengambil data kategori",
        variant: "error",
        duration: 5000,
        position: "top-center",
      });
    }
  };

  // fungsi ini mengambil data barang dengan search & pagination
  const fetchBarang = useCallback(async () => {
    setIsLoading(true);
    try {
      const barangResponse = await getBarang(
        debouncedSearch,
        currentPage,
        ITEM_PER_HALAMAN
      );
      setDataBarang(barangResponse.data);
      setTotalCount(barangResponse.totalCount);
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

  // useEffect untuk data barang
  useEffect(() => {
    fetchBarang();
  }, [fetchBarang]);

  // useEffect untuk data kategori
  useEffect(() => {
    fetchKategori();
  }, []);

  const totalPages = Math.ceil(totalCount / ITEM_PER_HALAMAN);

  return (
    <div>
      <Breadcrumb />

      <div className="flex items-center w-full mt-8 justify-between">
        <div className="relative flex items-start px-4 mb-4 gap-4">
          <Button
            className={`flex gap-2 items-center text-white text-sm rounded-sm px-4 py-2 cursor-pointer bg-emerald-500 hover:bg-emerald-600`}
            onClick={() => setOpenAdd(!openAdd)}
          >
            <MdOutlineAddBox className="size-5" />
            <span className="text-sm font-normal">Tambah Barang</span>
          </Button>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Cari Barang"
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
        <TabelBarang
          dataBarang={dataBarang}
          openEdit={openEdit}
          setOpenEdit={setOpenEdit}
          openDelete={openDelete}
          setOpenDelete={setOpenDelete}
          icon={<MdModeEdit className="size-4" />}
          kategoriData={kategoriData}
          toaster={toaster}
          onSuccess={fetchBarang}
        />

        {dataBarang.length > 0 && (
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
        <TambahDataBarang
          open={openAdd}
          setOpen={setOpenAdd}
          kategoriData={kategoriData}
          toaster={toaster}
          onSuccess={fetchBarang}
        />
      )}
    </div>
  );
};

export default DataBarangPage;
