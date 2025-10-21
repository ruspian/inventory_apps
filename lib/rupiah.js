export const rupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", // mata uang
    currency: "IDR", // kode mata uang indonesia
    minimumFractionDigits: 0, // angka di belakang koma
  }).format(value);
};
