import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { Bot, ChevronRight, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden bg-background">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] mix-blend-normal pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] mix-blend-normal pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <Bot size={20} />
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">SlashBot</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link 
            href="/login" 
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Admin Login
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-fade-in">
          <Sparkles size={16} />
          <span>Next-Gen Discord Bot Management</span>
        </div>
        
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl leading-tight">
          Manage your Discord <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
            slash commands seamlessly.
          </span>
        </h1>
        
        <p className="mt-6 text-lg sm:text-xl text-foreground/60 max-w-2xl font-light">
          A powerful dashboard for your Discord bot. Monitor interactions, configure webhooks, and utilize AI summarization all in one place.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link 
            href="/login" 
            className="group flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-hover hover:scale-105 transition-all shadow-xl shadow-primary/20"
          >
            Go to Dashboard
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a 
            href="https://discord.com/developers/applications" 
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-surface hover:bg-surface-hover text-foreground rounded-full font-medium transition-colors border border-border"
          >
            Developer Portal
          </a>
        </div>
      </div>
    </main>
  );
}
