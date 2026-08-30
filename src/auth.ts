import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = (token.role as string) || "OWNER";
        session.user.currentWorkspaceId =
          (token.currentWorkspaceId as string) || "dev-workspace-los-pollitos";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = "OWNER";
        token.currentWorkspaceId = "dev-workspace-los-pollitos";
      }
      return token;
    },
  },
});
