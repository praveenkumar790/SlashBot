import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
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

  const errorMessage = searchParams?.error === 'CredentialsSignin'
    ? 'Invalid email or password.'
    : searchParams?.error === 'Unknown'
    ? 'An error occurred during login.'
    : null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-950 p-6">
      <div className="w-full max-w-md rounded-lg bg-gray-900 p-8 shadow-xl ring-1 ring-gray-800">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-white">Admin Login</h1>
          <p className="mt-2 text-sm text-gray-400">Sign in to manage SlashBot.</p>
        </div>

        <form action={authenticate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-2 block w-full rounded-md bg-gray-800 border-0 py-2 px-3 text-white shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-2 block w-full rounded-md bg-gray-800 border-0 py-2 px-3 text-white shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
            />
          </div>

          {errorMessage && (
            <div className="text-sm text-red-500">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </main>
  );
}
