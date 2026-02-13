import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const path = req.nextUrl.pathname;
  const isLoggedIn = !!token;
  const isAdmin = token?.role === "ADMIN";

  //  Daftar halaman khusus ADMIN
  const adminPages = [
    "/dashboard",
    "/barang",
    "/supplier",
    "/kategori",
    "/stok-masuk",
    "/opname",
    "/laporan",
    "/riwayat",
  ];

  const isAccessingAdminPage = adminPages.some((p) => path.startsWith(p));
  const isAccessingKasirPage = path.startsWith("/kasir");

  // Jika belum login dan coba akses halaman terproteksi
  if (!isLoggedIn && (isAccessingAdminPage || isAccessingKasirPage)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Jika sudah login tapi coba akses Login Page ("/")
  if (isLoggedIn && path === "/") {
    return NextResponse.redirect(
      new URL(isAdmin ? "/dashboard" : "/kasir", req.url),
    );
  }

  // Jika user biasa  coba akses halaman ADMIN
  if (isLoggedIn && isAccessingAdminPage && !isAdmin) {
    return NextResponse.redirect(new URL("/kasir", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
