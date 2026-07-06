'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Settings,
  HelpCircle,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Bot,
  User,
  ChevronUp,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

const navLinks = [
  { href: '/dashboard', label: 'Interactions', icon: Activity },
  { href: '/dashboard/config', label: 'Configuration', icon: Settings },
  { href: '/dashboard/setup', label: 'Setup Guide', icon: HelpCircle },
];

interface SidebarProps {
  userEmail: string;
  signOutAction: () => Promise<void>;
}

export function Sidebar({ userEmail, signOutAction }: SidebarProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <aside
      className={`group flex-shrink-0 bg-surface border-r border-border flex flex-col z-20 shadow-lg transition-all duration-300 ease-in-out relative ${
        collapsed ? 'w-[68px]' : 'w-64'
      }`}
    >
      {/* Collapse Toggle (Notion-style absolute badge) */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute right-[-12px] top-5 bg-surface border border-border p-1.5 rounded-full shadow-md text-foreground/50 hover:text-foreground transition-all duration-200 z-35 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <PanelLeftOpen size={12} /> : <PanelLeftClose size={12} />}
      </button>

      {/* Top: Branding */}
      <div className="p-4 border-b border-border flex items-center min-w-0 h-[69px]">
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-md shadow-primary/20 flex-shrink-0">
            <Bot size={20} />
          </div>
          {!collapsed && (
            <span className="font-bold text-base tracking-tight text-foreground truncate">
              SlashBot
            </span>
          )}
        </Link>
      </div>

      {/* Middle: Navigation */}
      <nav className="flex-1 overflow-y-auto py-3">
        <ul className="space-y-1 px-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  title={collapsed ? link.label : undefined}
                  className={`flex items-center gap-2.5 rounded-lg transition-all font-medium ${
                    collapsed ? 'justify-center px-2.5 py-2.5' : 'px-3 py-2.5'
                  } ${
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-foreground/70 hover:text-foreground hover:bg-surface-hover border border-transparent'
                  }`}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  {!collapsed && (
                    <span className="whitespace-nowrap overflow-hidden text-sm">{link.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom: Admin popover launcher */}
      <div className="p-3 border-t border-border relative" ref={menuRef}>
        {/* Floating popover menu */}
        {menuOpen && (
          <div
            className={`absolute bottom-[76px] bg-surface border border-border rounded-xl shadow-2xl p-3 flex flex-col gap-2 min-w-[200px] z-50 animate-in fade-in slide-in-from-bottom-2 duration-150 ${
              collapsed ? 'left-3' : 'left-3 right-3'
            }`}
          >
            <div className="px-2 py-1.5 border-b border-border/60">
              <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider block">
                Signed in as
              </span>
              <span className="text-sm font-medium text-foreground truncate block mt-0.5" title={userEmail}>
                {userEmail}
              </span>
            </div>
            
            <div className="flex flex-col gap-1">
              {/* Theme Toggle option */}
              <ThemeToggle />

              {/* Sign Out option */}
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-foreground/70 hover:text-red-500 hover:bg-red-500/10 font-medium text-sm transition-all"
                >
                  <LogOut size={16} className="flex-shrink-0" />
                  <span>Sign Out</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Profile trigger button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`flex items-center gap-2.5 w-full rounded-xl p-2 hover:bg-surface-hover transition-colors text-left border border-transparent ${
            menuOpen ? 'bg-surface-hover border-border' : ''
          } ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Admin Options' : undefined}
        >
          {/* Circular avatar with A */}
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
            A
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground leading-none">Admin</p>
                <p className="text-xs text-foreground/40 leading-none mt-1">Options</p>
              </div>
              <ChevronUp size={16} className="text-foreground/40 flex-shrink-0" />
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
