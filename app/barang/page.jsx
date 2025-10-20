"use client";

import Breadcrumb from "@/components/Breadcrumb";
import TabelBarang from "@/components/TabelBarang";
import TambahDataBarang from "@/components/TambahDataBarang";
import { getKategori } from "@/lib/data";
import { useToaster } from "@/providers/ToasterProvider";
import React, { useEffect, useState } from "react";
import { MdModeEdit, MdOutlineAddBox } from "react-icons/md";

const DataBarangPage = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [kategoriData, setKategoriData] = useState([]);

  const toaster = useToaster();

  const Icons = [
    {
      icon: <MdOutlineAddBox className="size-5" />,
      label: "Tambah Barang",
      onclick: () => setOpenAdd(!openAdd),
      bgColor: "bg-emerald-600",
      onHover: "hover:bg-emerald-700",
    },
    {
      icon: <MdModeEdit className="size-5" />,
      label: "Edit Barang",
      onclick: () => setOpen(!open),
      bgColor: "bg-amber-600",
      onHover: "hover:bg-amber-700",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kategoryResponse] = await Promise.all([getKategori()]);

        setKategoriData(kategoryResponse);
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

    fetchData();
  }, [toaster]);

  return (
    <div>
      <Breadcrumb />

      <div className="flex items-center justify-between w-full mt-8">
        <div className="relative flex items-start px-4 mb-4 gap-4">
          {Icons.map((item, index) => (
            <div
              className={`flex gap-2 items-center text-white text-sm rounded-sm px-4 py-2 cursor-pointer ${item.bgColor} ${item.onHover} `}
              key={index + item.label}
              onClick={item.onclick}
            >
              {item.icon} {item.label}
            </div>
          ))}
        </div>
      </div>

      <div className="">
        <TabelBarang />
      </div>

      {openAdd && (
        <TambahDataBarang
          open={openAdd}
          setOpen={setOpenAdd}
          kategoriData={kategoriData}
        />
      )}
    </div>
  );
};

export default DataBarangPage;
