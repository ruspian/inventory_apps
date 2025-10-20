import Breadcrumb from "@/components/Breadcrumb";
import SearchBarKasir from "@/components/SearchBarKasir";
import TabelKasir from "@/components/TabelKasir";
import { Button } from "@/components/ui/button";
import React from "react";

const KasirPage = () => {
  return (
    <div>
      <Breadcrumb />

      {/* pencarian */}
      <div className="">
        <SearchBarKasir />
      </div>

      <div className="mt-8">
        <TabelKasir />
      </div>

      <Button
        className="mt-4 hover:bg-emerald-600 border border-emerald-600 hover:text-white hover:border-none hover:trasition duration-300 ease-in-out"
        variant="outline"
      >
        Bayar
      </Button>
    </div>
  );
};

export default KasirPage;
