import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TabelBarangJasaTerlaris({ barangTerlaris }) {
  return (
    <div className="">
      <div className="overflow-x-auto rounded-sm border border-neutral-200 bg-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="h-9 py-2">Nama Barang</TableHead>
              <TableHead className="h-9 py-2">Kategori</TableHead>
              <TableHead className="h-9 py-2">Total Terjual</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {barangTerlaris.length > 0 ? (
              barangTerlaris.map((barang, index) => (
                <TableRow key={index + 1}>
                  <TableCell className="py-2 font-medium">
                    {barang.nama}
                  </TableCell>
                  <TableCell className="py-2">{barang.kategori}</TableCell>
                  <TableCell className="py-2">{barang.totalTerjual}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-4 text-center">
                  Belum ada data barang terlaris.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
