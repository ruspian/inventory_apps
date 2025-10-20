import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const programmingLanguages = [
  {
    id: "1",
    name: "JavaScript",
    releaseYear: "1995",
    developer: "Brendan Eich",
    typing: "Dynamic",
  },
  {
    id: "2",
    name: "Python",
    releaseYear: "1991",
    developer: "Guido van Rossum",
    typing: "Dynamic",
  },
  {
    id: "3",
    name: "Java",
    releaseYear: "1995",
    developer: "James Gosling",
    typing: "Static",
  },
  {
    id: "4",
    name: "C++",
    releaseYear: "1985",
    developer: "Bjarne Stroustrup",
    typing: "Static",
  },
  {
    id: "5",
    name: "Ruby",
    releaseYear: "1995",
    developer: "Yukihiro Matsumoto",
    typing: "Dynamic",
  },
];

export default function TabelBarangJasaTerlaris() {
  return (
    <div className="">
      <div className="overflow-x-auto rounded-sm border border-neutral-200 bg-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="h-9 py-2">Kode</TableHead>
              <TableHead className="h-9 py-2">Nama Barang</TableHead>
              <TableHead className="h-9 py-2">Stok</TableHead>
              <TableHead className="h-9 py-2">Kategori</TableHead>
              <TableHead className="h-9 py-2">Satuan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programmingLanguages.map((language) => (
              <TableRow key={language.id}>
                <TableCell className="py-2 font-medium">
                  {language.name}
                </TableCell>
                <TableCell className="py-2">{language.releaseYear}</TableCell>
                <TableCell className="py-2">{language.releaseYear}</TableCell>
                <TableCell className="py-2">{language.developer}</TableCell>
                <TableCell className="py-2">{language.typing}</TableCell>
                <TableCell className="py-2">{language.paradigm}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export { Component };
