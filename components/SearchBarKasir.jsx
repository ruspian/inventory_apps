"use client";

import React from "react";
import { useForm } from "react-hook-form";

const SearchBarKasir = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="mt-4 hidden">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("search")} />
      </form>
    </div>
  );
};

export default SearchBarKasir;
