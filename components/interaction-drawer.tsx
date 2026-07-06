'use client';

import * as React from 'react';
import { X, Sparkles, Server, User, Calendar, Terminal } from 'lucide-react';

interface InteractionDrawerProps {
  interaction: any | null;
  onClose: () => void;
}

export function InteractionDrawer({ interaction, onClose }: InteractionDrawerProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (interaction) {
      // Trigger slide-in animation on next tick
      const timer = setTimeout(() => setMounted(true), 50);
      return () => clearTimeout(timer);
    } else {
      setMounted(false);
    }
  }, [interaction]);

  if (!interaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={`relative w-full max-w-lg bg-surface border-l border-border h-full shadow-2xl flex flex-col z-10 transition-transform duration-300 ease-out transform ${
          mounted ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <Terminal size={18} className="text-primary" />
            <h3 className="text-lg font-bold text-foreground">Interaction Details</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-hover text-foreground/50 hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-background border border-border flex items-start gap-3">
              <User size={16} className="text-foreground/40 mt-0.5" />
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider block">User</span>
                <span className="text-sm font-semibold text-foreground block truncate mt-0.5">{interaction.username}</span>
                <span className="text-xs text-foreground/50 truncate block mt-0.5">{interaction.discordUserId}</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-background border border-border flex items-start gap-3">
              <Server size={16} className="text-foreground/40 mt-0.5" />
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider block">Server</span>
                <span className="text-sm font-semibold text-foreground block truncate mt-0.5">{interaction.server?.name || 'Unknown'}</span>
                <span className="text-xs text-foreground/50 truncate block mt-0.5">{interaction.server?.guildId || '-'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-background border border-border flex items-start gap-3">
              <Terminal size={16} className="text-foreground/40 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider block">Command</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mt-1">
                  /{interaction.commandName}
                </span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-background border border-border flex items-start gap-3">
              <Calendar size={16} className="text-foreground/40 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider block">Timestamp</span>
                <span className="text-sm font-semibold text-foreground block mt-1">
                  {mounted ? new Date(interaction.createdAt).toLocaleString() : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Full Input Text */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground/40 uppercase tracking-wider block">Input Message</label>
            <div className="p-5 rounded-xl bg-background border border-border text-sm text-foreground/80 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap select-text">
              {interaction.inputText || <span className="text-foreground/30 italic">No input message</span>}
            </div>
          </div>

          {/* AI Summary Section */}
          {interaction.aiSummary && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground/40 uppercase tracking-wider block">AI Summary Analysis</label>
              <div className="p-5 rounded-xl bg-primary/5 border border-primary/15 flex items-start gap-3">
                <Sparkles size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-xs font-bold text-primary uppercase tracking-wider block">AI summary response</span>
                  <p className="text-sm text-foreground/80 mt-1.5 leading-relaxed select-text">{interaction.aiSummary}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
