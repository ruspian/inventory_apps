import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { tanggal } from "@/lib/tanggal";
import { Button } from "./ui/button";
import { TbListDetails } from "react-icons/tb";
import DetailPenjualan from "./DetailPenjualan";

export default function TabelLaporanPenjualan({
  dataLaporanPenjualan,
  openDetail,
  setOpenDetail,
  idPenjualan,
  setIdPenjualan,
}) {
  return (
    <div className="">
      <div className="overflow-x-auto rounded-sm border border-neutral-200 bg-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="h-9 py-2">No</TableHead>
              <TableHead className="h-9 py-2">Tanggal</TableHead>
              <TableHead className="h-9 py-2">ID Struk</TableHead>
              <TableHead className="h-9 py-2">Total Belanja</TableHead>
              <TableHead className="h-9 py-2">Dibayar</TableHead>
              <TableHead className="h-9 py-2">Kembalian</TableHead>
              <TableHead className="h-9 py-2">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataLaporanPenjualan.length > 0 ? (
              dataLaporanPenjualan.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="py-2 font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell className="py-2">
                    {tanggal(item.createdAt)}
                  </TableCell>
                  <TableCell className="py-2">{item.id}</TableCell>
                  <TableCell className="py-2">{item.total}</TableCell>
                  <TableCell className="py-2">{item.dibayar}</TableCell>
                  <TableCell className="py-2">{item.kembalian}</TableCell>
                  <TableCell className="py-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="px-3 cursor-pointer"
                      onClick={() => {
                        setOpenDetail(!openDetail);
                        setIdPenjualan(item.id);
                      }}
                    >
                      <TbListDetails className="mr-2" />
                      Detail
                    </Button>
                  </TableCell>
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

      {openDetail && (
        <DetailPenjualan
          open={openDetail}
          setOpen={setOpenDetail}
          dataLaporanPenjualan={dataLaporanPenjualan}
          idPenjualan={idPenjualan}
        />
      )}
    </div>
  );
}
