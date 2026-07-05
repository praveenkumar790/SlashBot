import { auth, signOut } from '@/auth';
import Link from 'next/link';
import { Activity, Settings, HelpCircle, LogOut } from 'lucide-react';
import { redirect } from 'next/navigation';

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
    <div className="flex h-screen overflow-hidden bg-gray-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold">SlashBot Admin</h1>
          <p className="text-sm text-gray-400 mt-1">{session.user?.email}</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            <li>
              <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-gray-300 hover:text-white">
                <Activity size={18} />
                <span>Interactions</span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/config" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-gray-300 hover:text-white">
                <Settings size={18} />
                <span>Configuration</span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/setup" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-gray-300 hover:text-white">
                <HelpCircle size={18} />
                <span>Setup Guide</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <form action={handleSignOut}>
            <button type="submit" className="flex w-full items-center gap-3 px-3 py-2 rounded-md hover:bg-red-900/30 text-gray-400 hover:text-red-400 transition-colors">
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-gray-950">
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
