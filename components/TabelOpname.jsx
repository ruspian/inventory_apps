"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { MdDeleteOutline, MdModeEdit } from "react-icons/md";
import { useState } from "react";
import EditSupplier from "./EditSupplier";
import DeleteSupplier from "./DeleteSupplier";
import { tanggal } from "@/lib/tanggal";

export default function TabelOpname({
  dataStokOpname,
  openEdit,
  setOpenEdit,
  toaster,
  onSuccess,
  openDelete,
  setOpenDelete,
}) {
  console.log("dataStokOpname", dataStokOpname);

  return (
    <div className="">
      <div className="overflow-x-auto rounded-sm border border-neutral-200 bg-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="h-9 py-2">No</TableHead>
              <TableHead className="h-9 py-2">Tanggal</TableHead>
              <TableHead className="h-9 py-2">Nama Barang</TableHead>
              <TableHead className="h-9 py-2">Kode Barang</TableHead>
              <TableHead className="h-9 py-2">Tipe</TableHead>
              <TableHead className="h-9 py-2">Stok Sistem</TableHead>
              <TableHead className="h-9 py-2">Stok Fisik</TableHead>
              <TableHead className="h-9 py-2">Selisih</TableHead>
              <TableHead className="h-9 py-2">Dicatat Oleh</TableHead>
              <TableHead className="h-9 py-2">Catatan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataStokOpname.length > 0 ? (
              dataStokOpname.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="py-2 font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell className="py-2">
                    {tanggal(item.createdAt)}
                  </TableCell>
                  <TableCell className="py-2">{item.barang.nama}</TableCell>
                  <TableCell className="py-2">
                    {item.barang.kodeBarang}
                  </TableCell>
                  <TableCell className="py-2">{item.tipe}</TableCell>
                  <TableCell className="py-2">{item.stokSebelum}</TableCell>
                  <TableCell className="py-2">{item.stokSesudah}</TableCell>
                  <TableCell className="py-2">{item.jumlah}</TableCell>
                  <TableCell className="py-2">{item.user.name}</TableCell>
                  <TableCell className="py-2">{item.catatan}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="py-2 font-medium text-center"
                  colSpan={10}
                >
                  Tidak ada data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {openEdit && (
        <EditSupplier
          open={openEdit}
          setOpen={setOpenEdit}
          dataSupplier={dataSupplier}
          idSupplier={idSupplier}
          toaster={toaster}
          onSuccess={onSuccess}
        />
      )}

      {openDelete && (
        <DeleteSupplier
          open={openDelete}
          setOpen={setOpenDelete}
          idSupplier={idSupplier}
          toaster={toaster}
          onSuccess={onSuccess}
          dataSupplier={dataSupplier}
        />
      )}
    </div>
  );
}
