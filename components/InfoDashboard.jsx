import { rupiah } from "@/lib/rupiah";
import React from "react";
import { HiDocumentCurrencyDollar } from "react-icons/hi2";
import { FaChartSimple, FaSackDollar } from "react-icons/fa6";

const BadgeDashboard = ({ infoData }) => {
  const items = [
    {
      icon: <HiDocumentCurrencyDollar size={50} />,
      title: "Omset Hari Ini",
      count: rupiah(infoData.omset),
      sub: "",
    },
    {
      icon: <FaSackDollar size={50} />,
      title: "Profit Hari Ini",
      count: rupiah(infoData.profit),
      sub: "",
    },
    {
      icon: <FaChartSimple size={50} />,
      title: "Jumlah Transaksi Hari Ini",
      count: infoData.transaksi,
      sub: "Barang",
    },
  ];
  return (
    <div className="flex gap-4 mt-8">
      {items.map((item, index) => (
        <div
          key={index + item.title}
          className="flex gap-4 border items-center p-4 rounded-md "
        >
          {item.icon}
          <div className="">
            <p className="font-semibold">{item.title}</p>
            <p className="font-black text-4xl">
              {item.count}{" "}
              <span className="text-sm font-normal">{item.sub}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BadgeDashboard;
