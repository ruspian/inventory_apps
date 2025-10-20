"use client";

import { Button } from "@/components/ui/button";
import { SquarePlus } from "lucide-react";
import {
  MorphingPopover,
  MorphingPopoverContent,
  MorphingPopoverTrigger,
} from "@/components/ui/morphing-popover";
import { useForm } from "react-hook-form";
import { useToaster } from "@/providers/ToasterProvider";
// import { formatToYyyyMmDd } from "@/lib/formatTanggal";

const TambahDataBarang = ({ open, setOpen, kategoriData }) => {
  const toaster = useToaster();
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    const payload = {
      siswaId: data.siswaId,
      tanggal: formatToYyyyMmDd(data.tanggal),
      uraian_kejadian: data.uraian_kejadian,
      tanggapan_siswa: data.tanggapan_siswa,
      arahan: data.arahan,
      kesepakatan: data.kesepakatan,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/pembinaan-kasus`,
        {
          method: "POST",
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
          message: errorData.message || "Gagal menambah data pembinaan wali",
          variant: "error",
          duration: 5000,
          position: "top-center",
        });
        return;
      }

      // jika sukses tampilkan notifikasi
      toaster.current?.show({
        title: "Berhasil!",
        message: "Data pembinaan wali berhasil ditambahkan",
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
        message: String(error) || "Gagal menambah data pembinaan wali",
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
          <Button variant="outline">
            <SquarePlus size={16} />
          </Button>
        </MorphingPopoverTrigger>

        <MorphingPopoverContent>
          <h2 className="text-lg font-semibold mb-4">Tambah Barang</h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* tanggal */}
            <div>
              <input
                {...register("kode", { required: true })}
                className="border rounded-sm p-2 w-full"
                placeholder="Kode Barang"
              />
            </div>

            {/* nama */}
            <div>
              <input
                {...register("nama")}
                className="border rounded-sm p-2 w-full"
                placeholder="Nama Barang"
              />
            </div>

            {/* deskripsi */}
            <div>
              <input
                {...register("deskripsi")}
                className="border rounded-sm p-2 w-full"
                placeholder="Deskripsi Barang"
              />
            </div>

            {/* tipe */}
            <div>
              <select
                {...register("tipe")}
                className="border rounded-sm p-2 w-full"
              >
                <option value="" className="text-gray-400">
                  Pilih Tipe Barang
                </option>
                <option value="1" className="text-gray-400">
                  Barang
                </option>
                <option value="1" className="text-gray-400">
                  Jasa
                </option>
              </select>
            </div>

            {/* Kategori */}
            <div>
              <select
                {...register("kategoriId")}
                className="border rounded-sm p-2 w-full"
              >
                <option value="" className="text-gray-400">
                  Pilih Kategori
                </option>
                {kategoriData.length > 0 &&
                  kategoriData.map((kategori) => (
                    <option key={kategori.id} value={kategori.id}>
                      {kategori.nama}
                    </option>
                  ))}
              </select>
            </div>

            {/* satuan */}
            <div>
              <select
                {...register("satuan")}
                className="border rounded-sm p-2 w-full"
              >
                <option value="" className="text-gray-400">
                  Pilih Satuan
                </option>
                <option value="pcs" className="text-gray-400">
                  Pcs
                </option>
                <option value="lembar" className="text-gray-400">
                  Lembar
                </option>
                <option value="rim" className="text-gray-400">
                  Rim
                </option>
                <option value="jasa" className="text-gray-400">
                  Jasa
                </option>
                <option value="pack" className="text-gray-400">
                  Pack
                </option>
                <option value="Btl" className="text-gray-400">
                  Botol
                </option>
              </select>
            </div>

            {/* stok */}
            <div>
              <input
                {...register("stok")}
                className="border rounded-sm p-2 w-full"
                placeholder="Stok Barang"
              />
            </div>

            {/* tanggapan siswa */}
            <div>
              <input
                {...register("harga_beli")}
                className="border rounded-sm p-2 w-full"
                placeholder="Harga Beli"
              />
            </div>

            {/* arahan wali */}
            <div>
              <input
                {...register("harga_jual")}
                className="border rounded-sm p-2 w-full"
                placeholder="Harga Jual"
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

export default TambahDataBarang;
