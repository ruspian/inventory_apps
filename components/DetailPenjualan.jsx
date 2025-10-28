import React from "react";
import {
  MorphingPopover,
  MorphingPopoverContent,
  MorphingPopoverTrigger,
} from "./ui/morphing-popover";
import { tanggal } from "@/lib/tanggal";
import { rupiah } from "@/lib/rupiah";

const DetailPenjualan = ({
  open,
  setOpen,
  idPenjualan,
  dataLaporanPenjualan,
  onSuccess,
  toaster,
}) => {
  console.log("dataLaporanPenjualan", dataLaporanPenjualan);

  const findPenjualanById = dataLaporanPenjualan.find(
    (penjualan) => penjualan.id === idPenjualan
  );

  console.log("findPenjualanById", findPenjualanById);

  return (
    <div className="flex gap-2 justify-center">
      <MorphingPopover open={open} onOpenChange={setOpen}>
        <MorphingPopoverTrigger asChild>
          {/* <Button variant="outline"><SquarePlus size={16} /></Button> */}
        </MorphingPopoverTrigger>

        <MorphingPopoverContent>
          <div className="">
            <h3 className="font-semibold text-lg mb-4">Detail Penjualan</h3>

            {/* ID Struk dan tanggal */}
            <div className="space-y-2 flex justify-between gap-2 border-b">
              <p className="font-bold text-sm">
                ID Struk:{" "}
                <span className="font-normal">{findPenjualanById.id}</span>
              </p>
              <p className="font-bold text-sm">
                Tanggal:{" "}
                <span className="font-normal">
                  {tanggal(findPenjualanById.createdAt)}
                </span>
              </p>
            </div>

            {/* detail penjualan */}
            <div className="border-b my-4 space-y-2">
              {findPenjualanById.detail.map((detail) => (
                <div key={detail.id} className="flex justify-between py-2 ">
                  <div className="">
                    <p className="font-bold text-sm">{detail.barang.nama}</p>
                    <small>
                      {detail.jumlah} {detail.barang.satuan} X{" "}
                      {rupiah(detail.barang.hargaJual)}{" "}
                    </small>
                  </div>
                  <p className="font-normal text-sm">
                    {rupiah(detail.subTotal)}
                  </p>
                </div>
              ))}
            </div>

            {/* total pembayaran */}
            <div className="space-y-2 border-b pb-2">
              <div className="flex justify-between gap-2 font-bold text-sm">
                <p>Total:</p>
                <span className="font-normal">
                  {rupiah(findPenjualanById.total)}
                </span>
              </div>

              <div className="flex justify-between gap-2 font-bold text-sm">
                <p>Bayar:</p>
                <span className="font-normal">
                  {rupiah(findPenjualanById.dibayar)}
                </span>
              </div>

              <div className="flex justify-between gap-2 font-bold text-sm">
                <p>Kembali:</p>
                <span className="font-normal">
                  {rupiah(findPenjualanById.kembalian)}
                </span>
              </div>
            </div>
          </div>
        </MorphingPopoverContent>
      </MorphingPopover>
    </div>
  );
};

export default DetailPenjualan;
