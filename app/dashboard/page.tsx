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

    // We can call the cron endpoint logic or just trigger the mirror directly.
    // For simplicity in a Server Action, we'll fetch our own API route or invoke the logic.
    // It's better to just ping the background API route to avoid blocking the UI response.
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
          <h2 className="text-2xl font-bold tracking-tight">Recent Interactions</h2>
          <p className="text-gray-400 mt-1">View the last 50 bot interactions across all servers.</p>
        </div>
        <form action={retryMirror}>
          <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium">
            <RefreshCw size={16} />
            Retry Failed Mirrors
          </button>
        </form>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-950/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Server</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Command</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Input</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Mirror Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {interactions.map((interaction) => (
              <tr key={interaction.id} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-200">{interaction.username}</div>
                  <div className="text-xs text-gray-500">{interaction.discordUserId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{interaction.server?.name || 'Unknown'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-800/50">
                    /{interaction.commandName}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-300 max-w-xs truncate" title={interaction.inputText || ''}>
                    {interaction.inputText || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {interaction.commandName === 'report' ? (
                    <div className="flex items-center gap-2">
                      {interaction.mirrorStatus === 'sent' && <CheckCircle2 size={16} className="text-green-500" />}
                      {interaction.mirrorStatus === 'failed' && <XCircle size={16} className="text-red-500" />}
                      {interaction.mirrorStatus === 'pending' && <Clock size={16} className="text-yellow-500" />}
                      <span className="text-sm text-gray-300 capitalize">{interaction.mirrorStatus}</span>
                      {interaction.mirrorRetries > 0 && (
                        <span className="text-xs text-gray-500">({interaction.mirrorRetries} retries)</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {new Date(interaction.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {interactions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No interactions found. Invite the bot and run a command!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
