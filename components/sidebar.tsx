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
  const pathname = usePathname();

  return (
    <aside
      className={`flex-shrink-0 bg-surface border-r border-border flex flex-col z-20 shadow-lg transition-all duration-300 ease-in-out ${
        collapsed ? 'w-[68px]' : 'w-64'
      }`}
    >
      {/* Top: Branding + Collapse Toggle */}
      <div className="p-4 border-b border-border flex items-center justify-between gap-2">
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
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-surface-hover text-foreground/50 hover:text-foreground transition-colors flex-shrink-0"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
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

      {/* Bottom: User info, Theme, Sign Out */}
      <div className="border-t border-border p-2 space-y-1">
        {/* User Info */}
        {!collapsed && (
          <div className="px-3 py-2">
            <p className="text-xs text-foreground/40 uppercase tracking-wider font-semibold">Admin</p>
            <p className="text-sm text-foreground/70 truncate mt-0.5">{userEmail}</p>
          </div>
        )}

        {/* Theme Toggle */}
        <ThemeToggle collapsed={collapsed} />

        {/* Sign Out */}
        <form action={signOutAction}>
          <button
            type="submit"
            title={collapsed ? 'Sign Out' : undefined}
            className={`flex w-full items-center gap-2.5 rounded-lg transition-all text-foreground/70 hover:text-red-500 hover:bg-red-500/10 font-medium ${
              collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'
            }`}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {!collapsed && <span className="text-sm whitespace-nowrap overflow-hidden">Sign Out</span>}
          </button>
        </form>
      </div>
    </aside>
  );
}
