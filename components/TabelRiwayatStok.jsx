"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { tanggal } from "@/lib/tanggal";
import EditStokMasuk from "./EditStokMasuk";

export default function TabelRiwayatStok({
  dataRiwayatStok,
  openEdit,
  setOpenEdit,
  toaster,
  onSuccess,
  dataBarang,
  dataSupplier,
}) {
  return (
    <div className="">
      <div className="overflow-x-auto rounded-sm border border-neutral-200 bg-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="h-9 py-2">No</TableHead>
              <TableHead className="h-9 py-2">Nama</TableHead>
              <TableHead className="h-9 py-2">Tipe</TableHead>
              <TableHead className="h-9 py-2">Jumlah</TableHead>
              <TableHead className="h-9 py-2">Stok Sebelum</TableHead>
              <TableHead className="h-9 py-2">Stok Sesudah</TableHead>
              <TableHead className="h-9 py-2">User</TableHead>
              <TableHead className="h-9 py-2">Pemasok</TableHead>
              <TableHead className="h-9 py-2">Tanggal</TableHead>
              <TableHead className="h-9 py-2">Catatan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataRiwayatStok.length > 0 ? (
              dataRiwayatStok.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="py-2 font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell className="py-2">{item.barang.nama}</TableCell>
                  <TableCell className="py-2">{item.tipe}</TableCell>
                  <TableCell className="py-2">{item.jumlah}</TableCell>
                  <TableCell className="py-2">{item.stokSebelum}</TableCell>
                  <TableCell className="py-2">{item.stokSesudah}</TableCell>
                  <TableCell className="py-2">{item.user.name}</TableCell>
                  <TableCell className="py-2">
                    {item.supplier?.nama || "-"}
                  </TableCell>
                  <TableCell className="py-2">
                    {tanggal(item.createdAt)}
                  </TableCell>
                  <TableCell className="py-2">{item.catatan}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="py-2 font-medium text-center"
                  colSpan={11}
                >
                  Tidak ada data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {openEdit && (
        <EditStokMasuk
          open={openEdit}
          setOpen={setOpenEdit}
          toaster={toaster}
          dataSupplier={dataSupplier}
          onSuccess={onSuccess}
          dataBarang={dataBarang}
        />
      )}
    </div>
  );
}
