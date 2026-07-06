import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import bcrypt from 'bcryptjs';

export const { auth, signIn, signOut, handlers: { GET, POST } } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { email, password } = credentials;

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminEmail || !adminPasswordHash) {
          console.error('Missing ADMIN_EMAIL or ADMIN_PASSWORD_HASH in environment variables.');
          return null;
        }

        if (email === adminEmail) {
          const passwordsMatch = await bcrypt.compare(password as string, adminPasswordHash);
          if (passwordsMatch) {
            return { id: '1', name: 'Admin', email: adminEmail };
          }
        }

        return null;
      },
    }),
  ],
});
