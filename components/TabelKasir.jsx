import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CiSquareMinus, CiSquarePlus } from "react-icons/ci";

export default function TabelKasir({
  dataKeranjang,
  updateJumlah,
  hapusBarang,
}) {
  return (
    <div className="">
      <div className="overflow-x-auto rounded-sm border border-neutral-200 bg-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="h-9 py-2">Nama Barang</TableHead>
              <TableHead className="h-9 py-2">Harga Satuan</TableHead>
              <TableHead className="h-9 py-2">Jumlah</TableHead>
              <TableHead className="h-9 py-2">Subtotal</TableHead>
              <TableHead className="h-9 py-2">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataKeranjang.map((barang) => (
              <TableRow key={barang.id}>
                <TableCell className="py-2 font-medium">
                  {barang.nama}
                </TableCell>
                <TableCell className="py-2">{barang.hargaJual}</TableCell>
                <TableCell className="py-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateJumlah(barang.id, barang.jumlah - 1)}
                      className="cursor-pointer"
                    >
                      <CiSquareMinus />
                    </button>
                    <span>{barang.jumlah}</span>
                    <button
                      onClick={() => updateJumlah(barang.id, barang.jumlah + 1)}
                      className="cursor-pointer"
                    >
                      <CiSquarePlus />
                    </button>
                  </div>
                </TableCell>
                <TableCell className="py-2">
                  {barang.hargaJual * barang.jumlah}
                </TableCell>
                <TableCell className="py-2">
                  <button
                    onClick={() => hapusBarang(barang.id)}
                    className="text-red-500"
                  >
                    Hapus
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
