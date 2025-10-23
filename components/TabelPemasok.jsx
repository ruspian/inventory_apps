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

export default function TabelPemasok({
  dataSupplier,
  openEdit,
  setOpenEdit,
  toaster,
  onSuccess,
  openDelete,
  setOpenDelete,
}) {
  const [idSupplier, setIdSupplier] = useState("");
  return (
    <div className="">
      <div className="overflow-x-auto rounded-sm border border-neutral-200 bg-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="h-9 py-2">No</TableHead>
              <TableHead className="h-9 py-2">Nama</TableHead>
              <TableHead className="h-9 py-2">Kontak</TableHead>
              <TableHead className="h-9 py-2">Alamat</TableHead>
              <TableHead className="h-9 py-2 flex justify-center">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataSupplier.length > 0 ? (
              dataSupplier.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="py-2 font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell className="py-2">{item.nama}</TableCell>
                  <TableCell className="py-2">{item.kontak}</TableCell>
                  <TableCell className="py-2">{item.alamat}</TableCell>
                  <TableCell className="py-2 flex gap-2 justify-center">
                    <Button
                      className={`flex gap-2 items-center text-white text-sm rounded-sm px-2 py-1 cursor-pointer bg-amber-500 hover:bg-amber-600`}
                      onClick={() => {
                        setOpenEdit(!openEdit);
                        setIdSupplier(item.id);
                      }}
                    >
                      <MdModeEdit className="size-4" />
                    </Button>

                    <Button
                      className={`flex gap-2 items-center text-white text-sm rounded-sm px-2 py-1 cursor-pointer bg-red-500 hover:bg-red-600`}
                      onClick={() => {
                        setOpenDelete(!openDelete);
                        setIdSupplier(item.id);
                      }}
                    >
                      <MdDeleteOutline className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="py-2 font-medium text-center" colSpan={5}>
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
