import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export default async function ConfigPage() {
  const servers = await prisma.server.findMany({
    orderBy: { createdAt: 'desc' },
  });

  async function toggleConfig(formData: FormData) {
    'use server';
    const serverId = formData.get('serverId') as string;
    const type = formData.get('type') as 'mirror' | 'ai';
    const currentValue = formData.get('currentValue') === 'true';

    if (!serverId || !type) return;

    if (type === 'mirror') {
      await prisma.server.update({
        where: { id: serverId },
        data: { mirrorEnabled: !currentValue },
      });
    } else if (type === 'ai') {
      await prisma.server.update({
        where: { id: serverId },
        data: { aiSummarizationEnabled: !currentValue },
      });
    }
    
    revalidatePath('/dashboard/config');
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Server Configuration</h2>
        <p className="text-foreground/60 mt-1">Manage feature toggles for each Discord server your bot is in.</p>
      </div>

      <div className="grid gap-6">
        {servers.map((server) => (
          <div key={server.id} className="bg-surface border border-border rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">{server.name}</h3>
              <p className="text-sm text-foreground/50 font-mono mt-1">ID: {server.guildId}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
              <form action={toggleConfig} className="flex items-center gap-3">
                <input type="hidden" name="serverId" value={server.id} />
                <input type="hidden" name="type" value="mirror" />
                <input type="hidden" name="currentValue" value={server.mirrorEnabled.toString()} />
                <span className="text-sm font-medium text-foreground/80">Webhook Mirroring</span>
                <button 
                  type="submit" 
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                    server.mirrorEnabled ? 'bg-primary' : 'bg-surface-hover border border-border'
                  }`}
                >
                  <span 
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      server.mirrorEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`} 
                  />
                </button>
              </form>

              <form action={toggleConfig} className="flex items-center gap-3">
                <input type="hidden" name="serverId" value={server.id} />
                <input type="hidden" name="type" value="ai" />
                <input type="hidden" name="currentValue" value={server.aiSummarizationEnabled.toString()} />
                <span className="text-sm font-medium text-foreground/80">AI Summarization</span>
                <button 
                  type="submit" 
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                    server.aiSummarizationEnabled ? 'bg-primary' : 'bg-surface-hover border border-border'
                  }`}
                >
                  <span 
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      server.aiSummarizationEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`} 
                  />
                </button>
              </form>
            </div>
          </div>
        ))}

        {servers.length === 0 && (
          <div className="bg-surface border border-border rounded-xl p-12 text-center text-foreground/50">
            No servers found. The bot needs to be invited to a server and process at least one command first.
          </div>
        )}
      </div>
    </div>
  );
}
