"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToaster } from "@/providers/ToasterProvider";

export default function SignUpPage() {
  const [type, setType] = useState("password");
  const [errorMessage, setErrorMessage] = useState(null);

  const router = useRouter();
  const toaster = useToaster();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // Kirim data ke API
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      //   jika error
      if (!response.ok) {
        const errorState = await response.json();
        setErrorMessage(errorState.message);

        toaster.current?.show({
          title: "Error",
          message: errorState.message,
          variant: "error",
          duration: 5000,
          position: "top-center",
        });
        return;
      }

      toaster.current?.show({
        title: "Berhasil",
        message: "Pendaftaran berhasil!",
        variant: "success",
        duration: 5000,
        position: "top-center",
      });

      // jika berhasil arahkan ke dashboard
      router.push("/dashboard");
    } catch (error) {
      toaster.current?.show({
        title: "Error",
        message: String(error),
        variant: "error",
        duration: 5000,
        position: "top-center",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex items-center gap-4 mb-10">
        <Image src="/logo.png" alt="logo" width={50} height={50} priority />
        <div className="flex flex-col">
          <p className="text-3xl font-semibold">UsahaKu</p>
          <span className="text-xs">Stok aman, hati tenang</span>
        </div>
      </div>

      <div className="bg-neutral-50 shadow-xl p-5 rounded-sm">
        <h1 className="flex items-center justify-center md:text-2xl gap-2 mb-5">
          Daftar!
        </h1>

        <form
          className="flex flex-col gap-2 md:w-[400px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* name */}
          <div className="flex flex-col">
            <label className="text-sm">Nama</label>
            <input
              {...register("name", { required: true })}
              className="border border-neutral-300 rounded-sm p-2 focus:outline-none focus:ring-1 focus:ring-emerald-300"
            />
            {errors.name && (
              <span className="text-red-500 text-xs">
                Nama tidak boleh kosong!
              </span>
            )}
          </div>

          {/* email */}
          <div className="flex flex-col">
            <label className="text-sm">Email</label>
            <input
              {...register("email", { required: true })}
              className="border border-neutral-300 rounded-sm p-2 focus:outline-none focus:ring-1 focus:ring-emerald-300"
            />
            {errors.email && (
              <span className="text-red-500 text-xs">
                Email tidak boleh kosong!
              </span>
            )}
          </div>

          {/* password */}
          <div className="flex flex-col relative">
            <label className="text-sm">Password</label>
            <input
              {...register("password", { required: true })}
              className="border border-neutral-300 rounded-sm p-2 focus:outline-none focus:ring-1 focus:ring-emerald-300"
              type={type}
            />
            {type === "password" ? (
              <IoEyeOffOutline
                className="absolute right-4 top-8 cursor-pointer size-5"
                onClick={() => setType("text")}
              />
            ) : (
              <IoEyeOutline
                className="absolute right-4 top-8 cursor-pointer size-5"
                onClick={() => setType("password")}
              />
            )}
            {errors.email && (
              <span className="text-red-500 text-xs">
                Password tidak boleh kosong!
              </span>
            )}
          </div>

          {/* retype password */}
          <div className="flex flex-col relative">
            <label className="text-sm">Tulis ulang password</label>
            <input
              {...register("reTypePassword", { required: true })}
              className="border border-neutral-300 rounded-sm p-2 focus:outline-none focus:ring-1 focus:ring-emerald-300"
              type={type}
            />
            {type === "password" ? (
              <IoEyeOffOutline
                className="absolute right-4 top-8 cursor-pointer size-5"
                onClick={() => setType("text")}
              />
            ) : (
              <IoEyeOutline
                className="absolute right-4 top-8 cursor-pointer size-5"
                onClick={() => setType("password")}
              />
            )}
            {errors.reTypePassword ||
              (errorMessage && (
                <span className="text-red-500 text-xs">
                  {errors.reTypePassword
                    ? "Password tidak boleh kosong!"
                    : errorMessage}
                </span>
              ))}
          </div>

          <button
            type="submit"
            className="bg-emerald-500 text-white p-2 rounded-sm hover:bg-emerald-600 transition duration-300 ease-in-out cursor-pointer"
          >
            Daftar
          </button>
        </form>
      </div>
    </div>
  );
}
