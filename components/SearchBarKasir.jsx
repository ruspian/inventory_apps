"use client";

import React, { useEffect, useState } from "react";

const SearchBarKasir = ({ handleScanBarcode }) => {
  const [kode, setKode] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Jika tombol Enter ditekan DAN ada kode yang diketik
      if (e.key === "Enter" && kode.length > 0) {
        e.preventDefault(); // hentikan reload halaman default
        handleScanBarcode(kode); // Panggil fungsi utama
        setKode(""); // Reset ketikan
        return;
      }

      // Jika tombol yang ditekan BUKAN Enter atau tombol kontrol
      if (e.key.length === 1) {
        // Tambahkan karakter ke state kode
        setKode((prevKode) => prevKode + e.key);
      }
    };

    // Pasang listener di window
    window.addEventListener("keydown", handleKeyDown);

    // Bersihkan listener saat komponen unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [kode, handleScanBarcode]);

  // Komponen ini tidak me-render apa-apa
  return null;
};

export default SearchBarKasir;
