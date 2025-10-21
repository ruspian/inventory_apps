import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { rupiah } from "@/lib/rupiah";
import { Button } from "./ui/button";
import { MdDeleteOutline } from "react-icons/md";
import EditDataBarang from "./EditDataBarang";
import { useState } from "react";

export default function TabelBarang({
  dataBarang,
  openEdit,
  setOpenEdit,
  icon,
  kategoriData,
  toaster,
  onSuccess,
}) {
  const [idBarang, setIdBarang] = useState("");
  return (
    <div className="">
      <div className="overflow-x-auto rounded-sm border border-neutral-200 bg-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="h-9 py-2">Kode</TableHead>
              <TableHead className="h-9 py-2">Nama Barang</TableHead>
              <TableHead className="h-9 py-2">Deskripsi</TableHead>
              <TableHead className="h-9 py-2">Stok</TableHead>
              <TableHead className="h-9 py-2">Kategori</TableHead>
              <TableHead className="h-9 py-2">Satuan</TableHead>
              <TableHead className="h-9 py-2">Harga Beli</TableHead>
              <TableHead className="h-9 py-2">Harga Jual</TableHead>
              <TableHead className="h-9 py-2">Tipe</TableHead>
              <TableHead className="h-9 py-2">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataBarang.map((barang) => (
              <TableRow key={barang.id}>
                <TableCell className="py-2 font-medium">
                  {barang.kodeBarang}
                </TableCell>
                <TableCell className="py-2">{barang.nama}</TableCell>
                <TableCell className="py-2">{barang.deskripsi}</TableCell>
                <TableCell className="py-2">{barang.stok}</TableCell>
                <TableCell className="py-2">{barang.kategori.nama}</TableCell>
                <TableCell className="py-2">{barang.satuan}</TableCell>
                <TableCell className="py-2">
                  {rupiah(barang.hargaBeli)}
                </TableCell>
                <TableCell className="py-2">
                  {rupiah(barang.hargaJual)}
                </TableCell>
                <TableCell className="py-2">{barang.tipe}</TableCell>
                <TableCell className="py-2 flex gap-2">
                  <Button
                    className={`flex gap-2 items-center text-white text-sm rounded-sm px-2 py-1 cursor-pointer bg-amber-500 hover:bg-amber-600`}
                    onClick={() => {
                      setOpenEdit(!openEdit);
                      setIdBarang(barang.id);
                    }}
                  >
                    {icon}
                  </Button>
                  <Button
                    className={`flex gap-2 items-center text-white text-sm rounded-sm px-2 py-1 cursor-pointer bg-red-500 hover:bg-red-600`}
                    onClick={() => {
                      setOpenEdit(!openEdit);
                      setIdBarang(barang.id);
                    }}
                  >
                    <MdDeleteOutline className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {openEdit && (
        <EditDataBarang
          open={openEdit}
          setOpen={setOpenEdit}
          kategoriData={kategoriData}
          idBarang={idBarang}
          toaster={toaster}
          onSuccess={onSuccess}
          dataBarang={dataBarang}
        />
      )}
    </div>
  );
}

export { Component };
