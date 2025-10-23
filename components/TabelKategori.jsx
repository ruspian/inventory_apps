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
import EditKategori from "./EditKategori";
import DeleteKategori from "./DeletaKategori";

export default function TabelKategori({
  dataKategori,
  openEdit,
  setOpenEdit,
  toaster,
  onSuccess,
  openDelete,
  setOpenDelete,
}) {
  const [idKategori, setIdKategori] = useState("");
  return (
    <div className="md:w-[700px]">
      <div className="overflow-x-auto rounded-sm border border-neutral-200 bg-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="h-9 py-2">No</TableHead>
              <TableHead className="h-9 py-2">Nama</TableHead>
              <TableHead className="h-9 py-2 flex justify-center">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataKategori.length > 0 ? (
              dataKategori.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="py-2 font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell className="py-2">{item.nama}</TableCell>
                  <TableCell className="py-2 flex gap-2 justify-center">
                    <Button
                      className={`flex gap-2 items-center text-white text-sm rounded-sm px-2 py-1 cursor-pointer bg-amber-500 hover:bg-amber-600`}
                      onClick={() => {
                        setOpenEdit(!openEdit);
                        setIdKategori(item.id);
                      }}
                    >
                      <MdModeEdit className="size-4" />
                    </Button>

                    <Button
                      className={`flex gap-2 items-center text-white text-sm rounded-sm px-2 py-1 cursor-pointer bg-red-500 hover:bg-red-600`}
                      onClick={() => {
                        setOpenDelete(!openDelete);
                        setIdKategori(item.id);
                      }}
                    >
                      <MdDeleteOutline className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="py-2 font-medium">
                  Tidak ada data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {openEdit && (
        <EditKategori
          open={openEdit}
          setOpen={setOpenEdit}
          dataKategori={dataKategori}
          idKategori={idKategori}
          toaster={toaster}
          onSuccess={onSuccess}
        />
      )}

      {openDelete && (
        <DeleteKategori
          open={openDelete}
          setOpen={setOpenDelete}
          idKategori={idKategori}
          toaster={toaster}
          onSuccess={onSuccess}
          dataKategori={dataKategori}
        />
      )}
    </div>
  );
}

export { Component };
