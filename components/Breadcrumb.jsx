"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, House } from "lucide-react";

export default function Breadcrumb() {
  const pathname = usePathname();
  // Pecah pathname menjadi segmen. => "/dashboard/settings" => ["dashboard", "settings"]
  const segments = pathname.split("/").filter(Boolean);

  // Fungsi untuk mengubah "product-details" menjadi "Product Details"
  const formatSegment = (segment) => {
    return segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center space-x-2 text-sm text-gray-500 font-medium"
    >
      {/* Link Home selalu ada */}
      <Link href="/dashboard" className="hover:text-gray-700" aria-label="Home">
        <House size={17} strokeWidth={2.25} />
      </Link>

      {/* Render setiap segmen dari URL */}
      {segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const isLast = index === segments.length - 1;

        return (
          <React.Fragment key={href}>
            <ChevronRight size={17} strokeWidth={2.25} />
            {isLast ? (
              // Jika ini segmen terakhir, tampilkan sebagai teks
              <span className="text-indigo-500" aria-current="page">
                {formatSegment(segment)}
              </span>
            ) : (
              // Jika bukan, tampilkan sebagai link
              <Link href={href} className="hover:text-gray-700">
                {formatSegment(segment)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
