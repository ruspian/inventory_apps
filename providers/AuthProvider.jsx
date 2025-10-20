import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";

const AuthProvider = async ({ children }) => {
  const session = await auth();

  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default AuthProvider;
