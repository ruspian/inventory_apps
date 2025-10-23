"use client";

import { Button } from "@/components/ui/button";
import {
  MorphingPopover,
  MorphingPopoverContent,
  MorphingPopoverTrigger,
} from "@/components/ui/morphing-popover";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const EditSupplier = ({
  open,
  setOpen,
  onSuccess,
  toaster,
  idSupplier,
  dataSupplier,
}) => {
  const { register, handleSubmit, reset } = useForm();

  const findSupplierById = dataSupplier.find((item) => item.id === idSupplier);

  useEffect(() => {
    if (findSupplierById) {
      reset({
        nama: findSupplierById.nama,
        kontak: findSupplierById.kontak,
        alamat: findSupplierById.alamat,
      });
    }
  }, [findSupplierById, reset]);

  const onSubmit = async (data) => {
    const payload = {
      id: idSupplier,
      nama: data.nama,
      kontak: data.kontak,
      alamat: data.alamat,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/supplier`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      // jika response tidak ok
      if (!response.ok) {
        const errorData = await response.json();
        toaster.current?.show({
          title: "Kesalahan!",
          message: errorData.message || "Gagal edit pemasok!",
          variant: "error",
          duration: 5000,
          position: "top-center",
        });
        return;
      }

      // jika sukses tampilkan notifikasi
      toaster.current?.show({
        title: "Berhasil!",
        message: "Pemasok diupdate!",
        variant: "success",
        duration: 5000,
        position: "top-center",
      });

      // reset form
      reset();
      // tutup popover
      setOpen(false);

      // panggil onSuccess untuk refresh data di parent
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toaster.current?.show({
        title: "Kesalahan!",
        message: String(error) || "Kesalahan Pada Server!",
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
          {/* <Button variant="outline">
            <SquarePlus size={16} />
          </Button> */}
        </MorphingPopoverTrigger>

        <MorphingPopoverContent>
          <h2 className="text-lg font-semibold mb-4">Edit Pemasok</h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* nama */}
            <div>
              <input
                {...register("nama")}
                className="border rounded-sm p-2 w-full"
                placeholder="Nama Pemasok"
              />
            </div>

            {/* kontak */}
            <div>
              <input
                {...register("kontak")}
                className="border rounded-sm p-2 w-full"
                placeholder="Kontak"
              />
            </div>

            {/* alamat */}
            <div>
              <input
                {...register("alamat")}
                className="border rounded-sm p-2 w-full"
                placeholder="Alamat"
              />
            </div>

            {/* tombol simpan */}
            <Button
              className="cursor-pointer bg-emerald-500 text-white font-semibold hover:bg-emerald-600"
              type="submit"
            >
              Simpan
            </Button>
          </form>
        </MorphingPopoverContent>
      </MorphingPopover>
    </div>
  );
};

export default EditSupplier;
