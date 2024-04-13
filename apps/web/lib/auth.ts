import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import type { Adapter } from "next-auth/adapters";
import { SessionStrategy } from "next-auth";

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "secr3t",
  pages: {
    signIn: "/auth",
  },
  session: { strategy: "jwt" as SessionStrategy },
  callbacks: {
    async jwt({ token }: any) {
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.accessToken = token.accessToken;
        session.user.id = token.sub;
      }
      return session;
    },
  },
};
// hsingh's code from cms
interface RateLimiter {
  timestamps: Date[];
}
const userRateLimits = new Map<string, RateLimiter>();

export const rateLimit = (userId: string, rateLimitCount: number, rateLimitInterval: number): boolean => {
  const now = new Date();
  const userLimiter = userRateLimits.get(userId) ?? { timestamps: [] };

  userLimiter.timestamps = userLimiter.timestamps.filter(
    (timestamp) => now.getTime() - timestamp.getTime() < rateLimitInterval
  );

  if (userLimiter.timestamps.length >= rateLimitCount) {
    return false; // Rate limit exceeded
  }

  userLimiter.timestamps.push(now);
  userRateLimits.set(userId, userLimiter);
  return true;
};
