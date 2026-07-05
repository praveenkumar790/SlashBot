import { NextResponse } from 'next/server';
import { verifyDiscordRequest } from '@/lib/discord';
import { prisma } from '@/lib/db';
import { mirrorInteraction } from '@/lib/mirror';
import { waitUntil } from '@vercel/functions';

// Discord interaction types
const InteractionType = {
  PING: 1,
  APPLICATION_COMMAND: 2,
  MESSAGE_COMPONENT: 3,
  MODAL_SUBMIT: 5,
} as const;

// Discord response types
const InteractionResponseType = {
  PONG: 1,
  CHANNEL_MESSAGE_WITH_SOURCE: 4,
  DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE: 5,
} as const;

export async function POST(req: Request) {
  // Step 1: Verify Discord signature
  const result = await verifyDiscordRequest(req);

  if (!result.isValid) {
    return new NextResponse('Invalid request signature', { status: 401 });
  }

  const { body } = result;
  const { type } = body;

  // Step 2: Handle PING (type 1) — required for Discord endpoint verification
  if (type === InteractionType.PING) {
    return NextResponse.json({ type: InteractionResponseType.PONG });
  }

  // Step 3: Handle APPLICATION_COMMAND (type 2)
  if (type === InteractionType.APPLICATION_COMMAND) {
    // Immediately respond with a DEFERRED message to beat the 3-second timeout limit.
    // The background task will update the message when it finishes.
    waitUntil(processApplicationCommand(body));

    return NextResponse.json({
      type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
    });
  }

  // Unknown interaction type
  return new NextResponse('Unknown interaction type', { status: 400 });
}

// --- Background Processor ---

import { editOriginalResponse } from '@/lib/discord';

async function processApplicationCommand(body: any) {
  const { id, token, data, guild_id, member, user } = body;
  const commandName = data?.name;
  const discordUserId = member?.user?.id || user?.id || 'unknown';
  const username = member?.user?.username || user?.username || 'unknown';

  try {
    // 1. Ensure Server exists
    let serverId = '';
    if (guild_id) {
      const server = await prisma.server.upsert({
        where: { guildId: guild_id },
        update: {},
        create: {
          guildId: guild_id,
          name: 'Unknown Server',
        },
      });
      serverId = server.id;
    }

    // 2. Extract input text (if any)
    let inputText = '';
    if (data?.options && Array.isArray(data.options)) {
      const msgOption = data.options.find((opt: any) => opt.name === 'message');
      if (msgOption) inputText = msgOption.value;
    }

    // 3. Deduplicate interactions (Discord retries on timeout)
    try {
      await prisma.interaction.create({
        data: {
          id: id,
          serverId: serverId,
          discordUserId,
          username,
          commandName,
          inputText,
          status: 'completed',
        },
      });
    } catch (e: any) {
      if (e.code === 'P2002') {
        console.log(`Duplicate interaction ${id} detected. Ignoring.`);
        return;
      }
      throw e;
    }

    // 4. Handle specific commands and edit the deferred response
    if (commandName === 'status') {
      await editOriginalResponse(token, '🟢 **Bot Status:** Online and connected to database.');
      return;
    }

    if (commandName === 'report') {
      await editOriginalResponse(token, `✅ Thanks for your report! I've saved: \`${inputText}\``);
      // Trigger mirror in the background as well
      waitUntil(mirrorInteraction(id));
      return;
    }

    // Fallback
    await editOriginalResponse(token, `Received unknown command: ${commandName}`);

  } catch (error) {
    console.error('Error processing command:', error);
    await editOriginalResponse(token, '❌ An error occurred while processing your command.');
  }

  // Unknown interaction type
  return new NextResponse('Unknown interaction type', { status: 400 });
}
