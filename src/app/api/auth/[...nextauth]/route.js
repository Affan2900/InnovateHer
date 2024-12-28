
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCollection } from "@/lib/connect"; // Updated path to connect.js

export const authOptions = {
  
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Connect to the User collection
        const userCollection = await getCollection("users"); // Collection name must match your MongoDB setup

        if (!userCollection) {
          throw new Error("Unable to connect to User collection");
        }

        // Find user by email
        const user = await userCollection.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("No user found with this email");
        }

        // Compare password (hash comparison)
        const bcrypt = require("bcrypt");
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValidPassword) {
          throw new Error("Incorrect password");
        }

        // Return user details for the session and token
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          roles: user.roles,
          currentRole: user.currentRole,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.roles = user.roles;
        token.currentRole = user.currentRole;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.roles = token.roles;
      session.user.currentRole = token.currentRole;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // Adjust if you have custom sign-in pages
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
