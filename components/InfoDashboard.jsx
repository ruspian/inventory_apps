import { rupiah } from "@/lib/rupiah";
import { BookMinus, BookUser, BookX } from "lucide-react";
import React from "react";

const BadgeDashboard = ({ omset, profit, transaksi }) => {
  const items = [
    {
      icon: <BookUser size={50} />,
      title: "Omset Hari Ini",
      count: rupiah(omset),
      sub: "",
    },
    {
      icon: <BookX size={50} />,
      title: "Profit Hari Ini",
      count: rupiah(profit),
      sub: "",
    },
    {
      icon: <BookMinus size={50} />,
      title: "Jumlah Transaksi Hari Ini",
      count: transaksi,
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
