import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  async function handleSignOut() {
    'use server';
    await signOut();
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
      <Sidebar
        userEmail={session.user?.email || 'admin'}
        signOutAction={handleSignOut}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-background relative">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/5 blur-[150px] pointer-events-none rounded-full" />
        <div className="flex-1 overflow-y-auto p-8 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
