import { ExternalLink, ShieldCheck, Zap } from 'lucide-react';

export default function SetupPage() {
  const clientId = process.env.DISCORD_APPLICATION_ID || 'YOUR_CLIENT_ID';
  const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=2147502080&integration_type=0&scope=bot+applications.commands`;

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Setup Guide</h2>
        <p className="text-gray-400 mt-1">Follow these steps to get your bot running in your Discord server.</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-500">
              <ExternalLink size={20} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-200">1. Invite the Bot</h3>
              <p className="text-sm text-gray-400">Add the bot to your Discord server using the OAuth2 URL.</p>
            </div>
          </div>
          <div className="mt-4">
            <a 
              href={inviteUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium"
            >
              Click here to invite bot to server
            </a>
          </div>
        </div>

        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center text-green-500">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-200">2. Register Slash Commands</h3>
              <p className="text-sm text-gray-400">The slash commands need to be registered to your guild.</p>
            </div>
          </div>
          <div className="bg-gray-950 p-4 rounded-md border border-gray-800 font-mono text-sm text-gray-300">
            <p className="text-gray-500 mb-2"># If running locally, you can register commands by running:</p>
            <p>npx tsx scripts/register-commands.ts</p>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center text-purple-500">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-200">3. Test it out!</h3>
              <p className="text-sm text-gray-400">Go to your Discord server and try it.</p>
            </div>
          </div>
          <ul className="list-disc list-inside text-sm text-gray-400 space-y-2 ml-14">
            <li>Type <code className="bg-gray-800 px-1 py-0.5 rounded text-gray-200">/status</code> to check if the bot is online.</li>
            <li>Type <code className="bg-gray-800 px-1 py-0.5 rounded text-gray-200">/report message: "Hello"</code> to test the database and webhook mirror.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
