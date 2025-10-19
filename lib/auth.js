import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        // pastikan email dan password di isi
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        // Ambil email dan password
        const email = credentials.email;
        const password = credentials.password;

        // Cari user di database
        const user = await prisma.user.findUnique({
          where: { email: email },
        });

        if (!user || !user.password) {
          // Jika user tidak ditemukan atau tidak punya password
          return null;
        }

        // Bandingkan password yang diinput dengan hash di DB
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
          // Jika password salah
          return null;
        }

        // Jika semua cocok, kembalikan objek user
        return user;
      },
    }),
  ],
});
