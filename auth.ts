import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { prisma } from "@/lib/infrastructure/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
    async signIn({ user }) {
      if (!user.email) return false;
      
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            appAccounts: {
              create: {
                name: "My Wallet",
                balance: 0,
              },
            },
          },
        });
      } else {
        // Optional: Ensure at least one account exists if the user was created but has no accounts
        const accountCount = await prisma.appAccount.count({
          where: { userId: existingUser.id },
        });
        if (accountCount === 0) {
          await prisma.appAccount.create({
            data: {
              userId: existingUser.id,
              name: "My Wallet",
              balance: 0,
            },
          });
        }
      }
      return true;
    },
  },
  providers: [
    /* Disable Google for now
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    */
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Enter your username" },
        password: { label: "Password", type: "password", placeholder: "••••••••" },
      },
      async authorize(credentials) {
        const isAdmin = 
          credentials?.username === process.env.ADMIN_USERNAME &&
          credentials?.password === process.env.ADMIN_PASSWORD;
        
        const isDemo = 
          credentials?.username === process.env.DEMO_USERNAME &&
          credentials?.password === process.env.DEMO_PASSWORD;

        if (isAdmin || isDemo) {
          const email = isAdmin ? "admin@example.com" : "demo@example.com";
          const name = isAdmin ? "Shinchan" : "Demo User";

          // Ensure user exists in database and get the real ID
          let user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                name,
                email,
              },
            });
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        }
        return null;
      },
    }),
    ...authConfig.providers,
  ],
});
