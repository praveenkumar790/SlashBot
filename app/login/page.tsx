import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { Bot } from 'lucide-react';
import Link from 'next/link';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  async function authenticate(formData: FormData) {
    'use server';
    try {
      await signIn('credentials', {
        ...Object.fromEntries(formData),
        redirectTo: '/dashboard',
      });
    } catch (error) {
      if (error instanceof AuthError) {
        if (error.type === 'CredentialsSignin') {
          redirect('/login?error=CredentialsSignin');
        } else {
          redirect('/login?error=Unknown');
        }
      }
      throw error;
    }
  }

  const resolvedSearchParams = await searchParams;
  const errorMessage = resolvedSearchParams?.error === 'CredentialsSignin'
    ? 'Invalid email or password.'
    : resolvedSearchParams?.error === 'Unknown'
    ? 'An error occurred during login.'
    : null;

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-background overflow-hidden p-6">
      {/* Background Decorators */}
      <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[10%] w-[30%] h-[30%] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />
      
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30 hover:scale-105 transition-transform">
            <Bot size={32} />
          </Link>
        </div>

        <div className="backdrop-blur-xl bg-surface/80 border border-border rounded-2xl p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome Back</h1>
            <p className="mt-2 text-sm text-foreground/60">Sign in to manage your SlashBot.</p>
          </div>

          <form action={authenticate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-2 block w-full rounded-xl bg-background border border-border py-2.5 px-4 text-foreground shadow-sm placeholder:text-foreground/40 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all sm:text-sm"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-2 block w-full rounded-xl bg-background border border-border py-2.5 px-4 text-foreground shadow-sm placeholder:text-foreground/40 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all sm:text-sm"
                placeholder="••••••••"
              />
            </div>

            {errorMessage && (
              <div className="text-sm font-medium text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              className="flex w-full justify-center items-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary-hover hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
