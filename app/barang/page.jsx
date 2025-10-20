"use client";

import Breadcrumb from "@/components/Breadcrumb";
import TambahDataBarang from "@/components/TambahDataBarang";
import React, { useState } from "react";
import { CiViewList } from "react-icons/ci";
import { MdOutlineSpaceDashboard } from "react-icons/md";

const DataBarangPage = () => {
  const [open, setOpen] = useState(false);

  const Icons = [
    {
      icon: <MdOutlineSpaceDashboard />,
      label: "Tambah Barang",
      onclick: () => setOpen(!open),
    },
    {
      icon: <CiViewList />,
      label: "Edit Barang",
      onclick: () => setOpen(!open),
    },
  ];
  return (
    <div>
      <Breadcrumb />

      <div className="flex items-center justify-between w-full mt-8">
        <div className="relative flex items-start px-4 mb-4 gap-4">
          {Icons.map((item, index) => (
            <div
              className="flex gap-2 items-center border rounded-sm px-4 py-2"
              key={index + item.label}
              onClick={item.onclick}
            >
              {item.icon} {item.label}
            </div>
          ))}
        </div>
      </div>

      {open && <TambahDataBarang open={open} setOpen={setOpen} />}
      <h1>ini adalah halaman data barang</h1>
    </div>
  );
};

export default DataBarangPage;
