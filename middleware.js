import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// fungsi middleware utama
export default auth(async (req) => {
  const session = req.auth;
  const path = req.nextUrl.pathname;

  const isLoggedIn = !!session?.user; // cek apakah user sudah login
  const isAdmin = session?.user?.role === "ADMIN"; // cek apakah user admin

  // Daftar halaman yang HANYA boleh diakses ADMIN
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

  // Cek apakah user mencoba akses halaman admin
  if (adminPages.some((p) => path.startsWith(p))) {
    if (!isLoggedIn) {
      // Kalo belum login, arahkan ke login
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (!isAdmin) {
      // Kalo sudah login tapi bukan admin, arahkan ke kasir
      return NextResponse.redirect(new URL("/kasir", req.url));
    }
    // Kalo login DAN admin, biarkan masuk
    return NextResponse.next();
  }

  // halaman kasir Boleh diakses ADMIN atau USER
  if (path.startsWith("/kasir")) {
    if (!isLoggedIn) {
      // Kalo belum login, arahkan ke login
      return NextResponse.redirect(new URL("/", req.url));
    }
    // Kalo login apapun role-nya, biarkan masuk
    return NextResponse.next();
  }

  // Halaman Login
  if (path === "/") {
    if (isLoggedIn) {
      // Kalo UDAH login, jangan biarin liat halaman login lagi
      if (isAdmin) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } else {
        // Kalo role-nya USER, arahkan ke kasir
        return NextResponse.redirect(new URL("/kasir", req.url));
      }
    }
    // Kalo belum login, biarkan di halaman login
    return NextResponse.next();
  }

  // public routes
  return NextResponse.next();
});

// Config Matcher
// filter agar middleware tidak usah jalan di file gambar, statis, atau API.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
