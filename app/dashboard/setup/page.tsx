import { ExternalLink, ShieldCheck, Zap } from 'lucide-react';

export default function SetupPage() {
  const clientId = process.env.DISCORD_APPLICATION_ID || 'YOUR_CLIENT_ID';
  const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=2147502080&integration_type=0&scope=bot+applications.commands`;

  return (
    <div className="max-w-3xl space-y-8 relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none rounded-full" />
      
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Setup Guide</h2>
        <p className="text-foreground/60 mt-1">Follow these steps to get your bot running in your Discord server.</p>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm relative z-10">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <ExternalLink size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">1. Invite the Bot</h3>
              <p className="text-sm text-foreground/60">Add the bot to your Discord server using the OAuth2 URL.</p>
            </div>
          </div>
          <div className="mt-4 pl-14">
            <a 
              href={inviteUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg transition-all text-sm font-medium shadow-md shadow-primary/20 hover:scale-[1.02]"
            >
              Click here to invite bot to server
            </a>
          </div>
        </div>

        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">2. Register Slash Commands</h3>
              <p className="text-sm text-foreground/60">The slash commands need to be registered to your guild.</p>
            </div>
          </div>
          <div className="ml-14 bg-background p-4 rounded-lg border border-border font-mono text-sm text-foreground/80 shadow-inner">
            <p className="text-foreground/40 mb-2"># If running locally, you can register commands by running:</p>
            <p>npx tsx scripts/register-commands.ts</p>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/20">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">3. Test it out!</h3>
              <p className="text-sm text-foreground/60">Go to your Discord server and try it.</p>
            </div>
          </div>
          <ul className="list-disc list-inside text-sm text-foreground/70 space-y-3 ml-14">
            <li>Type <code className="bg-surface-hover px-1.5 py-0.5 rounded-md border border-border text-foreground font-mono">/status</code> to check if the bot is online.</li>
            <li>Type <code className="bg-surface-hover px-1.5 py-0.5 rounded-md border border-border text-foreground font-mono">/report message: "Hello"</code> to test the database and webhook mirror.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
