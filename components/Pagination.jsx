import React from "react";
import { CiSquareChevLeft, CiSquareChevRight } from "react-icons/ci";

const Pagination = ({
  totalCount,
  setCurrentPage,
  currentPage,
  totalPages,
  isLoading,
}) => {
  return (
    <div className="flex justify-between items-center mt-4">
      <span className="text-sm text-neutral-500">
        Total {totalCount} barang
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1 || isLoading}
          className="disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          <CiSquareChevLeft className="size-8" />
        </button>
        <span className="p-2 text-sm border rounded-sm text-neutral-600">
          Halaman {currentPage} - {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage >= totalPages || isLoading}
          className="disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          <CiSquareChevRight className="size-8" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
