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

const EditStokMasuk = ({
  open,
  setOpen,
  dataBarang,
  dataSupplier,
  onSuccess,
  toaster,
  idStokMasuk,
  dataStokMasuk,
}) => {
  const findStokMasukById = dataStokMasuk.find(
    (stokMasuk) => stokMasuk.id === idStokMasuk
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      barangId: findStokMasukById.barangId || "",
      supplierId: findStokMasukById.supplierId || "",
      jumlah: findStokMasukById.jumlah || "",
      catatan: findStokMasukById.catatan || "",
    },
  });

  const [selectedBarang, setSelectedBarang] = useState(null);

  const session = useSession();

  useEffect(() => {
    if (findStokMasukById) {
      setValue("barangId", findStokMasukById.barangId);
      const selected = dataBarang.find(
        (b) => b.id === findStokMasukById.barangId
      );
      setSelectedBarang(selected || null);
    }
  }, [findStokMasukById, dataBarang, setValue]);

  const barangIdWatch = watch("barangId");

  const onSubmit = async (data) => {
    const payload = {
      id: idStokMasuk,
      tipe: "MASUK",
      jumlah: data.jumlah,
      stokSebelum: selectedBarang.stok,
      stokSesudah: parseInt(selectedBarang.stok) + parseInt(data.jumlah),
      catatan: data.catatan,
      barangId: data.barangId,
      supplierId: data.supplierId,
      userId: session.data.user.id,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/riwayat`,
        {
          method: "PUT",
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
                value={barangIdWatch}
                onChange={(event) => {
                  const select = dataBarang.find(
                    (barang) => barang.id === event.target.value
                  );

                  setSelectedBarang(select || null);
                  setValue("barangId", event.target.value);
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

            {/* supplier */}
            <div>
              <select
                {...register("supplierId", { required: true })}
                className="border rounded-sm p-2 w-full"
              >
                <option value="" className="text-gray-400">
                  Pilih Pemasok
                </option>
                {dataSupplier.map((supplier) => {
                  return (
                    <option
                      key={supplier.id}
                      value={supplier.id}
                      className="text-gray-400"
                    >
                      {supplier.nama}
                    </option>
                  );
                })}
              </select>

              {errors.supplierId && (
                <p className="text-red-500 text-sm mt-1">
                  Pilih pemasok yang ingin ditambah
                </p>
              )}
            </div>

            {/* jumlah */}
            <div>
              <input
                {...register("jumlah", { required: true })}
                className="border rounded-sm p-2 w-full"
                placeholder="Jumlah"
              />

              {errors.jumlah && (
                <p className="text-red-500 text-sm mt-1">Masukkan jumlah</p>
              )}
            </div>

            {/* catatan */}
            <div>
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

export default EditStokMasuk;
