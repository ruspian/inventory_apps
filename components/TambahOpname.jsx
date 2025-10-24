"use client";

import { Button } from "@/components/ui/button";
import {
  MorphingPopover,
  MorphingPopoverContent,
  MorphingPopoverTrigger,
} from "@/components/ui/morphing-popover";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const TambahOpname = ({ open, setOpen, dataBarang, onSuccess, toaster }) => {
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [getStokFisik, setGetStokFisik] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (selectedBarang) {
      reset({
        stok_sistem: selectedBarang.stok || 0,
        satuan: selectedBarang.satuan,
        selisih: parseInt(selectedBarang.stok) - parseInt(getStokFisik) || 0,
      });
    }
  }, [selectedBarang, getStokFisik, reset]);

  const session = useSession();

  const onSubmit = async (data) => {
    const payload = {
      tipe: "OPNAME",
      jumlah: data.selisih,
      stokSebelum: data.stok_sistem,
      stokSesudah: data.stok_fisik,
      catatan: data.catatan,
      barangId: data.barangId,
      userId: session.data.user.id,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/opname`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      // jika response tidak ok
      if (!response.ok) {
        const errorData = await response.json();
        toaster.current?.show({
          title: "Kesalahan!",
          message: errorData.message,
          variant: "error",
          duration: 5000,
          position: "top-center",
        });
        return;
      }

      // jika sukses tampilkan notifikasi
      toaster.current?.show({
        title: "Berhasil!",
        message: result.message,
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
      console.log(error);

      toaster.current?.show({
        title: "Kesalahan!",
        message: String(error),
        variant: "error",
        duration: 5000,
        position: "top-center",
      });
    }
  };

  console.log(getStokFisik);

  return (
    <div className="flex gap-2 justify-center">
      <MorphingPopover open={open} onOpenChange={setOpen}>
        <MorphingPopoverTrigger asChild>
          {/* <Button variant="outline">
            <SquarePlus size={16} />
          </Button> */}
        </MorphingPopoverTrigger>

        <MorphingPopoverContent>
          <h2 className="text-lg font-semibold mb-4">Tambah Barang</h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* barang */}
            <div>
              <select
                {...register("barangId", { required: true })}
                className="border rounded-sm p-2 w-full"
                onChange={(event) => {
                  const select = dataBarang.find(
                    (barang) => barang.id === event.target.value
                  );
                  setSelectedBarang(select);
                }}
              >
                <option value="" className="text-gray-400">
                  Pilih Barang
                </option>
                {dataBarang.map((barang) => {
                  return (
                    <option
                      key={barang.id}
                      value={barang.id}
                      className="text-gray-400"
                    >
                      {barang.nama}
                    </option>
                  );
                })}
              </select>

              {errors.barangId && (
                <p className="text-red-500 text-sm mt-1">
                  Pilih barang yang ingin ditambah
                </p>
              )}
            </div>

            {/* stok sistem dan satuan */}
            <div className="flex gap-4">
              <input
                {...register("stok_sistem")}
                className="border rounded-sm p-2 w-full"
                placeholder="Stok Sistem"
                disabled
              />

              <input
                {...register("satuan")}
                className="border rounded-sm p-2 w-full"
                placeholder="Satuan"
                disabled
              />
            </div>

            <div className="flex gap-4">
              <input
                {...register("stok_fisik")}
                className="border rounded-sm p-2 w-full"
                placeholder="Stok Fisik"
                onChange={(event) => {
                  const value = event.target.value;
                  setGetStokFisik(value);
                }}
              />
            </div>

            <div className="flex gap-4">
              <input
                {...register("selisih")}
                className="border rounded-sm p-2 w-full"
                placeholder="Selisih"
                disabled
              />
            </div>

            <div className="flex gap-4">
              <input
                {...register("catatan")}
                className="border rounded-sm p-2 w-full"
                placeholder="Catatan"
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

export default TambahOpname;
