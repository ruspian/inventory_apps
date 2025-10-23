"use client";

import { Button } from "@/components/ui/button";
import {
  MorphingPopover,
  MorphingPopoverContent,
  MorphingPopoverTrigger,
} from "@/components/ui/morphing-popover";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdAdd } from "react-icons/md";

const TambahKategori = ({ open, setOpen, onSuccess, toaster }) => {
  const { register, handleSubmit, reset } = useForm();

  const [kategoriView, setKategoriView] = useState([]);

  const onSubmit = async (data) => {
    // ubah data menjadi array
    setKategoriView((prev) => [...prev, data]);

    // hapus form setelah submit
    reset();
  };

  const handleSaveKategori = async (data) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/kategori`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nama: data.map((item) => item.nama) }),
        }
      );

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      toaster.current?.show({
        title: "Berhasil!",
        message: "Semua kategori berhasil ditambahkan!",
        variant: "success",
        duration: 5000,
        position: "top-center",
      });

      setOpen(false);
      onSuccess?.();
    } catch (error) {
      toaster.current?.show({
        title: "Kesalahan!",
        message: String(error) || "Gagal menambah data kategori",
        variant: "error",
        duration: 5000,
        position: "top-center",
      });
    }
  };

  const handleDeleteViewKategori = (index) => {
    setKategoriView((prev) => prev.filter((_, i) => i !== index));
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
          <h2 className="text-lg font-semibold mb-4">Tambah Kategori</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4">
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
              className="cursor-pointer bg-emerald-500 text-white font-semibold hover:bg-emerald-600"
              type="submit"
            >
              <MdAdd className="size-4" />
            </Button>
          </form>

          <div className="flex gap-2 my-4">
            {kategoriView.length > 0 &&
              kategoriView.map((item, index) => (
                <p
                  key={index}
                  className="px-2 py-1 bg-emerald-500 rounded-sm text-white flex gap-2 items-center "
                >
                  {item.nama}
                  <FaRegTrashAlt
                    className="size-3 cursor-pointer"
                    onClick={() => handleDeleteViewKategori(index)}
                  />
                </p>
              ))}
          </div>

          <Button
            className="cursor-pointer bg-emerald-500 text-white font-semibold hover:bg-emerald-600 my-2 w-full"
            onClick={() => handleSaveKategori(kategoriView)}
          >
            Simpan
          </Button>
        </MorphingPopoverContent>
      </MorphingPopover>
    </div>
  );
};

export default TambahKategori;
