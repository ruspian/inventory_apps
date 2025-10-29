import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TabelStokMenipis({ stokMenipis }) {
  return (
    <div className="">
      <div className="overflow-x-auto rounded-sm border border-neutral-200 bg-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="h-9 py-2">Kode Barang</TableHead>
              <TableHead className="h-9 py-2">Nama Barang</TableHead>
              <TableHead className="h-9 py-2">Stok</TableHead>
              <TableHead className="h-9 py-2">Kategori</TableHead>
              <TableHead className="h-9 py-2">Satuan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stokMenipis.length > 0 ? (
              stokMenipis.map((barang) => (
                <TableRow key={barang.id}>
                  <TableCell className="py-2 font-medium">
                    {barang.kodeBarang}
                  </TableCell>
                  <TableCell className="py-2">{barang.nama}</TableCell>
                  <TableCell className="py-2">{barang.stok}</TableCell>
                  <TableCell className="py-2">{barang.kategori.nama}</TableCell>
                  <TableCell className="py-2">{barang.satuan}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-4 text-center">
                  Stok barang menipis belum ada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
