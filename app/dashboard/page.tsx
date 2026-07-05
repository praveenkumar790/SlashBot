import { prisma } from '@/lib/db';
import { RefreshCw, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export default async function DashboardPage() {
  const interactions = await prisma.interaction.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { server: true },
  });

  async function retryMirror(formData: FormData) {
    'use server';
    const interactionId = formData.get('interactionId') as string;
    if (!interactionId) return;

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    await fetch(`${baseUrl}/api/cron/mirror-retry`, {
      method: 'GET',
    });
    
    revalidatePath('/dashboard');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Recent Interactions</h2>
          <p className="text-foreground/60 mt-1">View the last 50 bot interactions across all servers.</p>
        </div>
        <form action={retryMirror}>
          <button type="submit" className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-sm">
            <RefreshCw size={16} />
            Retry Failed Mirrors
          </button>
        </form>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-surface-hover/50">
              <tr>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wider">User</th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wider">Server</th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wider">Command</th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wider">Input</th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wider">Mirror Status</th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {interactions.map((interaction) => (
                <tr key={interaction.id} className="hover:bg-surface-hover/80 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">{interaction.username}</div>
                    <div className="text-xs text-foreground/50">{interaction.discordUserId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground/80">{interaction.server?.name || 'Unknown'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                      /{interaction.commandName}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-foreground/80 max-w-xs truncate" title={interaction.inputText || ''}>
                      {interaction.inputText || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {interaction.commandName === 'report' ? (
                      <div className="flex items-center gap-2">
                        {interaction.mirrorStatus === 'sent' && <CheckCircle2 size={16} className="text-emerald-500" />}
                        {interaction.mirrorStatus === 'failed' && <XCircle size={16} className="text-red-500" />}
                        {interaction.mirrorStatus === 'pending' && <Clock size={16} className="text-amber-500" />}
                        <span className="text-sm text-foreground/80 capitalize">{interaction.mirrorStatus}</span>
                        {interaction.mirrorRetries > 0 && (
                          <span className="text-xs text-foreground/50 ml-1">({interaction.mirrorRetries} retries)</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-foreground/40">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/60">
                    {new Date(interaction.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {interactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-foreground/50">
                    No interactions found. Invite the bot and run a command!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
