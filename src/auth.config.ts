import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig = {
  secret:
    process.env.AUTH_SECRET ||
    "los_pollitos_dev_secret_key_32_characters_minimum",
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || "dev_google_client_id",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "dev_google_client_secret",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
} satisfies NextAuthConfig;
