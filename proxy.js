import { NextResponse } from "next/server";

// fungsi middleware utama
export default proxy(async (req) => {
  const token = await getTokens({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
    salt:
      process.env.NODE_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
  });

  const session = !!token;
  const path = req.nextUrl.pathname;

  const isLoggedIn = !!session?.user;
  const isAdmin = session?.user?.role === "ADMIN";

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

  if (adminPages.some((p) => path.startsWith(p))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/kasir", req.url));
    }

    return NextResponse.next();
  }

  if (path.startsWith("/kasir")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  }

  if (path === "/") {
    if (isLoggedIn) {
      if (isAdmin) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } else {
        return NextResponse.redirect(new URL("/kasir", req.url));
      }
    }
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
