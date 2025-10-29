import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { rupiah } from "@/lib/rupiah";
import { tanggal } from "@/lib/tanggal";
import React from "react";

export default function TabelTransaksiTerakhir({ transaksiTerakhir }) {
  return (
    <div className="">
      <div className="overflow-x-auto rounded-sm border border-neutral-200 bg-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="h-9 py-2">Waktu Transaksi</TableHead>
              <TableHead className="h-9 py-2">Total Belanja</TableHead>
              <TableHead className="h-9 py-2">Barang Terjual</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transaksiTerakhir.length > 0 ? (
              transaksiTerakhir.map((barang, index) => (
                <TableRow key={index + 1}>
                  <TableCell className="py-2 font-medium">
                    {tanggal(barang.createdAt)}
                  </TableCell>
                  <TableCell className="py-2">{rupiah(barang.total)}</TableCell>
                  {barang.detail.map((item, index) => (
                    <TableCell key={item.id} className="py-2 flex flex-col">
                      {index + 1}. {item.barang.nama}{" "}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-4 text-center">
                  Belum ada transaksi terakhir.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export { Component };
