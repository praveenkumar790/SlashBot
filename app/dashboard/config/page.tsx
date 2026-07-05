import { prisma } from '@/lib/db';
import { Save } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export default async function ConfigPage() {
  const servers = await prisma.server.findMany({
    include: {
      configs: true,
    },
  });

  async function updateConfig(formData: FormData) {
    'use server';
    const serverId = formData.get('serverId') as string;
    const commandName = formData.get('commandName') as string;
    const mirrorEnabled = formData.get('mirrorEnabled') === 'on';
    const aiEnabled = formData.get('aiEnabled') === 'on';

    if (!serverId || !commandName) return;

    await prisma.commandConfig.upsert({
      where: {
        serverId_commandName: { serverId, commandName },
      },
      update: {
        mirrorEnabled,
        aiEnabled,
      },
      create: {
        serverId,
        commandName,
        mirrorEnabled,
        aiEnabled,
      },
    });

    revalidatePath('/dashboard/config');
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configuration</h2>
        <p className="text-gray-400 mt-1">Manage command settings for each Discord server.</p>
      </div>

      <div className="space-y-8">
        {servers.map((server) => {
          const reportConfig = server.configs.find((c) => c.commandName === 'report') || {
            mirrorEnabled: true,
            aiEnabled: false,
          };

          return (
            <div key={server.id} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-800 bg-gray-950/50">
                <h3 className="text-lg font-medium text-gray-200">{server.name}</h3>
                <p className="text-xs text-gray-500 font-mono mt-1">Guild ID: {server.guildId}</p>
              </div>
              
              <div className="p-6">
                <form action={updateConfig} className="max-w-xl">
                  <input type="hidden" name="serverId" value={server.id} />
                  <input type="hidden" name="commandName" value="report" />
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 border-b border-gray-800 pb-2 mb-4">/report Command Settings</h4>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label htmlFor={`mirror-${server.id}`} className="text-sm font-medium text-gray-200 cursor-pointer">
                          Webhook Mirroring
                        </label>
                        <p className="text-xs text-gray-500 mt-1">Forward /report inputs to the secondary Discord channel.</p>
                      </div>
                      <div className="flex items-center h-5">
                        <input
                          id={`mirror-${server.id}`}
                          name="mirrorEnabled"
                          type="checkbox"
                          defaultChecked={reportConfig.mirrorEnabled}
                          className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-600 focus:ring-offset-gray-900"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label htmlFor={`ai-${server.id}`} className="text-sm font-medium text-gray-200 cursor-pointer">
                          AI Summarization (Stretch Goal)
                        </label>
                        <p className="text-xs text-gray-500 mt-1">Automatically summarize reports using Gemini AI.</p>
                      </div>
                      <div className="flex items-center h-5">
                        <input
                          id={`ai-${server.id}`}
                          name="aiEnabled"
                          type="checkbox"
                          defaultChecked={reportConfig.aiEnabled}
                          className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-600 focus:ring-offset-gray-900"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-800">
                    <button type="submit" className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium border border-gray-700">
                      <Save size={16} />
                      Save Configuration
                    </button>
                  </div>
                </form>
              </div>
            </div>
          );
        })}

        {servers.length === 0 && (
          <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-lg">
            <p className="text-gray-500">No servers found. The bot needs to receive an interaction first.</p>
          </div>
        )}
      </div>
    </div>
  );
}
