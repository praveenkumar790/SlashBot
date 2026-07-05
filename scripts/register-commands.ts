import 'dotenv/config';
import { registerCommands } from '../lib/discord';

const guildId = process.env.DISCORD_GUILD_ID;

if (!guildId) {
  console.error('Missing DISCORD_GUILD_ID in .env');
  process.exit(1);
}

const commands = [
  {
    name: 'report',
    description: 'Report an issue or submit feedback to the admins.',
    type: 1, // CHAT_INPUT
    options: [
      {
        name: 'message',
        description: 'The content of your report',
        type: 3, // STRING
        required: true,
      },
    ],
  },
  {
    name: 'status',
    description: 'Check the bot status.',
    type: 1, // CHAT_INPUT
  },
];

async function main() {
  console.log(`Registering commands for guild ${guildId}...`);
  const res = await registerCommands(guildId!, commands);

  if (!res.ok) {
    const error = await res.text();
    console.error('Failed to register commands:', error);
    process.exit(1);
  }

  const data = await res.json();
  console.log('Successfully registered commands:', data.map((c: any) => c.name).join(', '));
}

main().catch(console.error);
