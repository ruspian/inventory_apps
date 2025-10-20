"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToaster } from "@/providers/ToasterProvider";

export default function Home() {
  const [type, setType] = useState("password");
  const [loginError, setLoginError] = useState("");

  const router = useRouter();
  const toaster = useToaster();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // fungsi onSubmit
  const onSubmit = async (data) => {
    setLoginError("");

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        // Jika Auth.js mengembalikan error
        setLoginError("Email atau password salah!");

        // tampilkan pesan error
        toaster.current?.show({
          title: "Error",
          message: String(error),
          variant: "error",
          duration: 5000,
          position: "top-center",
        });
      } else if (result?.ok) {
        // Jika login berhasil
        toaster.current?.show({
          title: "Berhasil",
          message: String("Login berhasil!"),
          variant: "success",
          duration: 5000,
          position: "top-center",
        });

        router.push("/dashboard"); // Arahkan ke halaman dashboard
      }
    } catch (error) {
      // Jika ada error jaringan atau lainnya
      setLoginError("Terjadi kesalahan. Coba lagi.");
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
          Selamat datang di <span className="text-emerald-500">UsahaKu</span>
        </h1>

        <form
          className="flex flex-col gap-2 md:w-[400px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Tampilkan pesan error jika login gagal */}
          {loginError && (
            <span className="text-center text-red-500 text-xs bg-red-100 p-2 rounded-sm">
              {loginError}
            </span>
          )}

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
                className="absolute right-4 top-8 cursor-pointer size-5"
                onClick={() => setType("text")}
              />
            ) : (
              <IoEyeOutline
                className="absolute right-4 top-8 cursor-pointer size-5"
                onClick={() => setType("password")}
              />
            )}
            {/* Tampilkan pesan error jika password tidak boleh kosong dan tidak cocok */}
            {errors.password && (
              <span className="text-red-500 text-xs">
                Password tidak boleh kosong!
              </span>
            )}
          </div>

          <button
            type="submit"
            className="bg-emerald-500 text-white p-2 rounded-sm hover:bg-emerald-600 transition duration-300 ease-in-out cursor-pointer disabled:bg-neutral-400"
            disabled={isSubmitting} // <--  disable tombol jika sedang loading
          >
            {isSubmitting ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
