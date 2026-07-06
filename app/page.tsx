import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { Bot, ChevronRight, Sparkles, Activity, Webhook, BrainCircuit } from 'lucide-react';

const features = [
  {
    icon: Activity,
    title: 'Real-time Monitoring',
    description: 'Track every slash command interaction across all your Discord servers in a unified dashboard.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  {
    icon: Webhook,
    title: 'Webhook Mirroring',
    description: 'Automatically forward user reports to a dedicated admin channel with retry logic built-in.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    icon: BrainCircuit,
    title: 'AI Summarization',
    description: 'Leverage Gemini AI to summarize long reports into actionable insights, appended to your mirror.',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden bg-background">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] mix-blend-normal pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] mix-blend-normal pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <Bot size={20} />
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">SlashBot</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground bg-surface hover:bg-surface-hover border border-border rounded-lg transition-colors"
          >
            Admin Login
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-12 pb-20 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
          <Sparkles size={14} />
          <span>Next-Gen Discord Bot Management</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl leading-[1.1]">
          Manage your Discord{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
            slash commands
          </span>
          {' '}seamlessly.
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-foreground/60 max-w-2xl font-light leading-relaxed">
          A powerful dashboard for your Discord bot. Monitor interactions, configure webhooks, and utilize AI summarization — all in one place.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/login"
            className="group flex items-center gap-2 px-7 py-3.5 bg-primary text-white rounded-full font-medium hover:bg-primary-hover hover:scale-105 transition-all shadow-xl shadow-primary/20"
          >
            Go to Dashboard
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="https://discord.com/developers/applications"
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3.5 bg-surface hover:bg-surface-hover text-foreground rounded-full font-medium transition-colors border border-border"
          >
            Developer Portal
          </a>
        </div>
      </div>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24 w-full">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Everything you need
          </h2>
          <p className="mt-3 text-foreground/60 text-lg max-w-xl mx-auto">
            Built-in tools to monitor, mirror, and summarize your bot&apos;s activity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group bg-surface border border-border rounded-2xl p-7 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg} ${feature.border} border flex items-center justify-center mb-5`}>
                  <Icon size={22} className={feature.color} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-foreground/40">
          <div className="flex items-center gap-2">
            <Bot size={16} />
            <span>SlashBot &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://discord.com/developers/docs" target="_blank" rel="noopener noreferrer" className="hover:text-foreground/70 transition-colors">
              Discord Docs
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground/70 transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
