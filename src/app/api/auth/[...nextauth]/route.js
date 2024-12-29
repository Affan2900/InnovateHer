import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCollection } from "@/lib/connect"; // Updated path to connect.js

export const authOptions = {
  session: {
    strategy: "jwt", // Use JWT to persist session data
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }, // Add role as a credential
      },
      async authorize(credentials) {
        console.log("Received credentials:", credentials);
        // Connect to the User collection
        const userCollection = await getCollection("users"); // Ensure correct MongoDB setup

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

        // Validate the provided role
        const { role } = credentials;
        if (!role || !user.roles.includes(role)) {
          console.error("Invalid role:", role, "Available roles:", user.roles);
    throw new Error("Invalid role selected");
  }

        // Return user details for the session and token
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          roles: user.roles,
          currentRole: role, // Set the current role dynamically
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // If user exists, populate the JWT with user details
      if (user) {
        token.id = user.id;
        token.roles = user.roles;
        token.currentRole = user.currentRole;
      }
      console.log('JWT Token:', token); // Debug log
      return token;
    },
    async session({ session, token }) {
      // Attach user details to the session object
      session.user.id = token.id;
      session.user.roles = token.roles;
      session.user.currentRole = token.currentRole;
      console.log('Session:', session); // Debug log
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // Adjust if you have custom sign-in pages
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
