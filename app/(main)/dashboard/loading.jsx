import { Skeleton } from "@/components/ui/skeleton";

// Ini adalah komponen Server, jadi nggak perlu 'use client'
export default function DashboardLoading() {
  return (
    <div className="flex flex-col space-y-6">
      {/* Skeleton untuk Breadcrumb */}
      <Skeleton className="h-6 w-1/3 rounded-sm" />

      {/*  Skeleton untuk InfoDashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>

      {/*  Skeleton untuk Tabel Stok Menipis */}
      <div className="mt-4">
        <Skeleton className="h-8 w-1/4 mb-2 rounded-sm" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>

      {/*  Skeleton untuk Tabel Terlaris */}
      <div className="mt-4">
        <Skeleton className="h-8 w-1/4 mb-2 rounded-sm" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    </div>
  );
}
