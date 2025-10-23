"use client";

import { Button } from "@/components/ui/button";
import {
  MorphingPopover,
  MorphingPopoverContent,
  MorphingPopoverTrigger,
} from "@/components/ui/morphing-popover";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const EditKategori = ({
  open,
  setOpen,
  onSuccess,
  toaster,
  dataKategori,
  idKategori,
}) => {
  const { register, handleSubmit, reset } = useForm();

  const findKategoriById = dataKategori.find((item) => item.id === idKategori);

  useEffect(() => {
    if (findKategoriById) {
      reset({
        nama: findKategoriById.nama,
      });
    }
  }, [findKategoriById, reset]);

  const onSubmit = async (data) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/kategori`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: idKategori,
            nama: data.nama,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      toaster.current?.show({
        title: "Berhasil!",
        message: "Kategori berhasil diubah!",
        variant: "success",
        duration: 5000,
        position: "top-center",
      });

      setOpen(false);
      onSuccess?.();
    } catch (error) {
      toaster.current?.show({
        title: "Kesalahan!",
        message: error.message,
        variant: "destructive",
        duration: 5000,
        position: "top-center",
      });
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      <MorphingPopover open={open} onOpenChange={setOpen}>
        <MorphingPopoverTrigger asChild>
          {/* <Button variant="outline">
            <SquarePlus size={16} />
          </Button> */}
        </MorphingPopoverTrigger>

        <MorphingPopoverContent>
          <h2 className="text-lg font-semibold mb-4">Edit Kategori</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="">
            {/* nama */}
            <div className="w-full">
              <input
                {...register("nama")}
                className="border rounded-sm p-2 w-full"
                placeholder="Kategori"
              />
            </div>

            {/* tombol add */}
            <Button
              className="cursor-pointer bg-emerald-500 text-white font-semibold hover:bg-emerald-600 w-full mt-4"
              type="submit"
            >
              Edit
            </Button>
          </form>
        </MorphingPopoverContent>
      </MorphingPopover>
    </div>
  );
};

export default EditKategori;
