import { ExternalLink, ShieldCheck, Zap, Bot, Terminal, ShieldAlert } from 'lucide-react';

export default function SetupPage() {
  const clientId = process.env.DISCORD_APPLICATION_ID || 'YOUR_CLIENT_ID';
  const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=2147502080&integration_type=0&scope=bot+applications.commands`;

  const botCommands = [
    {
      name: '/status',
      description: 'Check if the bot is online and successfully connected to the database.',
      options: 'None',
      scope: 'Global',
    },
    {
      name: '/report',
      description: 'Sends a report message. Toggles webhook mirroring and Gemini AI summaries.',
      options: 'message (string, required)',
      scope: 'Global',
    },
  ];

  return (
    <div className="space-y-6 relative max-w-7xl mx-auto">
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-[120px] pointer-events-none rounded-full" />
      
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Setup Guide</h2>
        <p className="text-foreground/60 mt-1">Get your SlashBot running in your server and view the command specs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        {/* Left Column: The 3 Steps */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
            {/* Step 1 */}
            <div className="p-6 border-b border-border">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 flex-shrink-0">
                  <ExternalLink size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-foreground">1. Invite the Bot</h3>
                  <p className="text-sm text-foreground/60 mt-1">Add the bot to your Discord server using the OAuth2 authorization URL.</p>
                  <div className="mt-4">
                    <a 
                      href={inviteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl transition-all text-sm font-semibold shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Click here to invite bot to server
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 border-b border-border">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 flex-shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-foreground">2. Register Slash Commands</h3>
                  <p className="text-sm text-foreground/60 mt-1">Slash commands need to be registered with Discord API for your guild.</p>
                  <div className="mt-4 bg-background p-4 rounded-xl border border-border font-mono text-xs text-foreground/80 shadow-inner overflow-x-auto">
                    <p className="text-foreground/40 mb-2"># If running locally, you can register commands by running:</p>
                    <p className="whitespace-nowrap">npx tsx scripts/register-commands.ts</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/20 flex-shrink-0">
                  <Zap size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-foreground">3. Test Bot Responses</h3>
                  <p className="text-sm text-foreground/60 mt-1">Go to your Discord channel and verify reactions to bot commands.</p>
                  <ul className="list-disc list-inside text-sm text-foreground/75 space-y-3 mt-4 ml-1">
                    <li>Type <code className="bg-background px-1.5 py-0.5 rounded-md border border-border text-foreground font-mono text-xs">/status</code> to check if the bot is online.</li>
                    <li>Type <code className="bg-background px-1.5 py-0.5 rounded-md border border-border text-foreground font-mono text-xs">/report message: "Hello"</code> to test database inserts and webhook mirror logs.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bot Command Reference */}
        <div className="lg:col-span-4 space-y-6">
          {/* Commands Specs */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Terminal size={18} className="text-primary" />
              <h3 className="text-base font-bold text-foreground">Command Specifications</h3>
            </div>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Quick specifications on the slash commands available out-of-the-box for SlashBot.
            </p>
            <div className="space-y-4 pt-2">
              {botCommands.map((cmd) => (
                <div key={cmd.name} className="p-4 rounded-xl bg-background border border-border space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-sm font-semibold text-primary">{cmd.name}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-surface border border-border rounded text-foreground/50">
                      {cmd.scope}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/60 leading-relaxed">{cmd.description}</p>
                  <div className="text-[10px] text-foreground/40 font-mono pt-1">
                    Arguments: {cmd.options}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
