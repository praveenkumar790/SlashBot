import { NextResponse } from 'next/server';
import { verifyDiscordRequest } from '@/lib/discord';

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

  // Step 3: Handle APPLICATION_COMMAND (type 2) — will be expanded in M4
  if (type === InteractionType.APPLICATION_COMMAND) {
    return NextResponse.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: '🤖 Bot is online! Command handling coming soon.',
      },
    });
  }

  // Unknown interaction type
  return new NextResponse('Unknown interaction type', { status: 400 });
}
