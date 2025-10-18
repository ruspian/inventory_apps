"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import Image from "next/image";

export default function Home() {
  const [type, setType] = useState("password");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
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
          Selamat datang di <span className="text-emerald-500">UsahaKu</span>
        </h1>

        <form
          className="flex flex-col gap-2 md:w-[400px]"
          onSubmit={handleSubmit(onSubmit)}
        >
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

          <div className="flex flex-col relative">
            <label className="text-sm">Password</label>
            <input
              {...register("password", { required: true })}
              className="border border-neutral-300 rounded-sm p-2 focus:outline-none focus:ring-1 focus:ring-emerald-300"
              type={type}
            />
            {type === "password" ? (
              <IoEyeOffOutline
                className="absolute right-4 top-9 cursor-pointer"
                onClick={() => setType("text")}
              />
            ) : (
              <IoEyeOutline
                className="absolute right-4 top-9 cursor-pointer"
                onClick={() => setType("password")}
              />
            )}
            {errors.email && (
              <span className="text-red-500 text-xs">
                Password tidak boleh kosong!
              </span>
            )}
          </div>

          <button
            type="submit"
            className="bg-emerald-500 text-white p-2 rounded-sm hover:bg-emerald-600 transition duration-300 ease-in-out cursor-pointer"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
