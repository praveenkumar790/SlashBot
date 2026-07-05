import { verifyKey } from 'discord-interactions';

const DISCORD_PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY!;
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!;
const DISCORD_APPLICATION_ID = process.env.DISCORD_APPLICATION_ID!;

/**
 * Verify an incoming Discord interaction request.
 * Returns the parsed body if valid, or null if verification fails.
 *
 * CRITICAL: Must read body as ArrayBuffer first, then verify with Buffer,
 * then parse JSON. This order cannot be changed.
 */
export async function verifyDiscordRequest(
  req: Request
): Promise<{ isValid: false } | { isValid: true; body: Record<string, unknown> }> {
  const signature = req.headers.get('x-signature-ed25519');
  const timestamp = req.headers.get('x-signature-timestamp');

  if (!signature || !timestamp) {
    return { isValid: false };
  }

  const rawBody = await req.arrayBuffer();
  const bodyBuffer = Buffer.from(rawBody);

  const isValid = await verifyKey(bodyBuffer, signature, timestamp, DISCORD_PUBLIC_KEY);

  if (!isValid) {
    return { isValid: false };
  }

  const body = JSON.parse(bodyBuffer.toString('utf-8'));
  return { isValid: true, body };
}

/**
 * Send a followup message to a Discord interaction.
 */
export async function sendFollowupMessage(
  interactionToken: string,
  content: string
): Promise<Response> {
  const url = `https://discord.com/api/v10/webhooks/${DISCORD_APPLICATION_ID}/${interactionToken}`;
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
    },
    body: JSON.stringify({ content }),
  });
}

/**
 * Edit the original interaction response (used for deferred responses).
 */
export async function editOriginalResponse(
  interactionToken: string,
  content: string
): Promise<Response> {
  const url = `https://discord.com/api/v10/webhooks/${DISCORD_APPLICATION_ID}/${interactionToken}/messages/@original`;
  return fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
    },
    body: JSON.stringify({ content }),
  });
}

/**
 * Register commands with Discord API (guild-scoped).
 */
export async function registerCommands(
  guildId: string,
  commands: Array<{
    name: string;
    description: string;
    type?: number;
    options?: Array<Record<string, unknown>>;
  }>
): Promise<Response> {
  const url = `https://discord.com/api/v10/applications/${DISCORD_APPLICATION_ID}/guilds/${guildId}/commands`;
  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
    },
    body: JSON.stringify(commands),
  });
}
