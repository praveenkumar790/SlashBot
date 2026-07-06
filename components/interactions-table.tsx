'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, Clock, Sparkles, RefreshCw, Send, Radio } from 'lucide-react';
import { InteractionDrawer } from '@/components/interaction-drawer';
import { retrySelectedInteractions } from '@/app/dashboard/actions';

interface InteractionsTableProps {
  initialInteractions: any[];
}

export function InteractionsTable({ initialInteractions }: InteractionsTableProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [activeInteraction, setActiveInteraction] = React.useState<any | null>(null);
  const [isRetrying, setIsRetrying] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    // Auto-refresh the page data every 5 seconds to show new Discord reports instantly
    const interval = setInterval(() => {
      router.refresh();
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);

  // Filter out which interactions are failed and therefore eligible for retry
  const failedInteractions = initialInteractions.filter(
    (item) => item.commandName === 'report' && item.mirrorStatus === 'failed'
  );

  const allFailedSelected =
    failedInteractions.length > 0 && selectedIds.length === failedInteractions.length;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(failedInteractions.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    e.stopPropagation();
    if (e.target.checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleRowClick = (interaction: any, event: React.MouseEvent) => {
    // Prevent opening drawer if clicking the checkbox/input directly
    const target = event.target as HTMLElement;
    if (target.closest('.checkbox-cell') || target.tagName === 'INPUT') {
      return;
    }
    setActiveInteraction(interaction);
  };

  const handleRetrySelected = async () => {
    if (selectedIds.length === 0) return;
    setIsRetrying(true);
    try {
      await retrySelectedInteractions(selectedIds);
      setSelectedIds([]);
    } catch (e) {
      console.error('Batch retry failed:', e);
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-surface-hover/50">
              <tr>
                <th scope="col" className="checkbox-cell px-6 py-3.5 text-left w-12">
                  {failedInteractions.length > 0 && (
                    <input
                      type="checkbox"
                      checked={allFailedSelected}
                      onChange={handleSelectAll}
                      className="rounded border-border bg-background text-primary focus:ring-primary focus:ring-offset-background h-4 w-4 transition-colors"
                      title="Select all failed mirrors"
                    />
                  )}
                </th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wider">User</th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wider">Server</th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wider">Command</th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wider">Input</th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wider">Mirror Status</th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {initialInteractions.map((interaction) => {
                const isFailed = interaction.commandName === 'report' && interaction.mirrorStatus === 'failed';
                const isSelected = selectedIds.includes(interaction.id);
                
                return (
                  <tr
                    key={interaction.id}
                    onClick={(e) => handleRowClick(interaction, e)}
                    className={`cursor-pointer hover:bg-surface-hover/80 transition-colors ${
                      isSelected ? 'bg-primary/5 hover:bg-primary/10' : ''
                    }`}
                  >
                    <td className="checkbox-cell px-6 py-4 whitespace-nowrap">
                      {isFailed && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectOne(e, interaction.id)}
                          className="rounded border-border bg-background text-primary focus:ring-primary focus:ring-offset-background h-4 w-4 transition-colors"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-foreground">{interaction.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-foreground/80">{interaction.server?.name || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                        /{interaction.commandName}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="text-sm text-foreground/80 flex items-center gap-1.5 min-w-0">
                        <span className="truncate flex-1" title="Click row to view full content">
                          {interaction.inputText || '-'}
                        </span>
                        {interaction.aiSummary && (
                          <span 
                            title="Has AI Summary Analysis" 
                            className="flex-shrink-0 text-primary inline-flex p-1 rounded-md bg-primary/5 border border-primary/10"
                          >
                            <Sparkles size={12} />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {interaction.commandName === 'report' ? (
                        <div className="flex items-center gap-2">
                          {interaction.mirrorStatus === 'sent' && <CheckCircle2 size={16} className="text-emerald-500" />}
                          {interaction.mirrorStatus === 'failed' && <XCircle size={16} className="text-red-500" />}
                          {interaction.mirrorStatus === 'pending' && <Clock size={16} className="text-amber-500" />}
                          <span className="text-sm text-foreground/80 capitalize">{interaction.mirrorStatus}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-foreground/40">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/60">
                      {mounted ? new Date(interaction.createdAt).toLocaleString() : ''}
                    </td>
                  </tr>
                );
              })}
              {initialInteractions.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-foreground/40">
                    No interactions found. Invite the bot and run a command!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-surface/90 backdrop-blur border border-border py-3 px-6 rounded-full shadow-2xl flex items-center gap-6 z-40 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <span className="text-sm font-semibold text-foreground/80">
            {selectedIds.length} failed mirror{selectedIds.length > 1 ? 's' : ''} selected
          </span>
          <div className="h-4 w-px bg-border" />
          <button
            onClick={handleRetrySelected}
            disabled={isRetrying}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white px-4 py-2 rounded-full transition-colors text-sm font-medium shadow-md shadow-primary/20"
          >
            {isRetrying ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Send size={14} />
            )}
            {isRetrying ? 'Retrying...' : 'Retry Webhooks'}
          </button>
        </div>
      )}

      {/* Slide-over details drawer */}
      <InteractionDrawer
        interaction={activeInteraction}
        onClose={() => setActiveInteraction(null)}
      />
    </div>
  );
}
