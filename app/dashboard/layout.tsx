import { auth, signOut } from '@/auth';
import Link from 'next/link';
import { Activity, Settings, HelpCircle, LogOut } from 'lucide-react';
import { redirect } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';

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
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-surface border-r border-border flex flex-col z-20 shadow-lg">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold tracking-tight text-foreground">SlashBot Admin</h1>
          <p className="text-sm text-foreground/60 mt-1 truncate">{session.user?.email}</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            <li>
              <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-hover transition-colors text-foreground/80 hover:text-foreground font-medium">
                <Activity size={18} />
                <span>Interactions</span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/config" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-hover transition-colors text-foreground/80 hover:text-foreground font-medium">
                <Settings size={18} />
                <span>Configuration</span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/setup" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-hover transition-colors text-foreground/80 hover:text-foreground font-medium">
                <HelpCircle size={18} />
                <span>Setup Guide</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <form action={handleSignOut} className="flex-1">
            <button type="submit" className="flex w-full items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 text-foreground/60 hover:text-red-500 transition-colors font-medium">
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </form>
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </div>
      </aside>

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
