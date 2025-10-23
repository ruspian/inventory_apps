import React from "react";
import {
  MorphingPopover,
  MorphingPopoverContent,
  MorphingPopoverTrigger,
} from "./ui/morphing-popover";
import { Button } from "./ui/button";

const DeleteKategori = ({
  open,
  setOpen,
  idKategori,
  dataKategori,
  onSuccess,
  toaster,
}) => {
  const findKategoriById = dataKategori.find(
    (kategori) => kategori.id === idKategori
  );

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/kategori`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: idKategori,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Terjadi kesalahan, silahkan coba lagi!");
      }

      const data = await response.json();
      toaster.current?.show({
        title: "Berhasil",
        message: String(data.message),
        variant: "success",
        duration: 5000,
        position: "top-center",
      });

      if (onSuccess) {
        onSuccess();
      }

      setOpen(false);
    } catch (error) {
      toaster.current?.show({
        title: "Error",
        message: error.message,
        variant: "error",
        duration: 5000,
        position: "top-center",
      });
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      <MorphingPopover open={open} onOpenChange={setOpen}>
        <MorphingPopoverTrigger asChild>
          {/* <Button variant="outline"><SquarePlus size={16} /></Button> */}
        </MorphingPopoverTrigger>

        <MorphingPopoverContent>
          <h2 className="text-lg font-semibold mb-4">
            Hapus {findKategoriById?.nama} dari kategori?
          </h2>

          <div className="flex justify-end gap-2">
            <Button
              className="cursor-pointer hover:bg-neutral-300"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              className="cursor-pointer hover:bg-red-700 text-white"
              onClick={handleDelete}
            >
              Hapus
            </Button>
          </div>
        </MorphingPopoverContent>
      </MorphingPopover>
    </div>
  );
};

export default DeleteKategori;
