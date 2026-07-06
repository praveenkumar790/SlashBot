'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle({ collapsed = false }: { collapsed?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch — only render icon after mount
  React.useEffect(() => setMounted(true), []);

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className={`relative flex items-center gap-2.5 rounded-lg transition-all text-foreground/70 hover:text-foreground hover:bg-surface-hover ${
        collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'
      }`}
      aria-label="Toggle theme"
      title={mounted ? (resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode') : 'Toggle theme'}
    >
      {mounted ? (
        resolvedTheme === 'dark' ? (
          <Sun size={18} className="flex-shrink-0" />
        ) : (
          <Moon size={18} className="flex-shrink-0" />
        )
      ) : (
        <Sun size={18} className="flex-shrink-0" />
      )}
      {!collapsed && (
        <span className="text-sm font-medium whitespace-nowrap overflow-hidden">
          {mounted ? (resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode') : 'Toggle Theme'}
        </span>
      )}
    </button>
  );
}
