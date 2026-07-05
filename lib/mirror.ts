import { prisma } from './db';

const MIRROR_WEBHOOK_URL = process.env.MIRROR_WEBHOOK_URL!;

export async function mirrorInteraction(interactionId: string) {
  // 1. Fetch interaction and server
  const interaction = await prisma.interaction.findUnique({
    where: { id: interactionId },
    include: { server: true }
  });

  if (!interaction || interaction.commandName !== 'report' || !interaction.inputText) {
    return;
  }

  // 2. Check server-specific config
  const config = await prisma.commandConfig.findUnique({
    where: { 
      serverId_commandName: { 
        serverId: interaction.serverId, 
        commandName: 'report' 
      } 
    }
  });

  if (config && !config.mirrorEnabled) {
    return; // Mirroring disabled for this server
  }

  // 3. Mirror the payload
  try {
    const content = `**New Report from ${interaction.username}** (Server: ${interaction.server.name})\n\n> ${interaction.inputText}`;
    
    const res = await fetch(MIRROR_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    if (!res.ok) {
      throw new Error(`Webhook failed with status: ${res.statusText}`);
    }

    // 4. Mark as sent
    await prisma.interaction.update({
      where: { id: interactionId },
      data: { mirrorStatus: 'sent' }
    });

  } catch (error) {
    console.error(`Mirror failed for interaction ${interactionId}:`, error);
    // Mark as failed and increment retries
    await prisma.interaction.update({
      where: { id: interactionId },
      data: { 
        mirrorStatus: 'failed',
        mirrorRetries: { increment: 1 }
      }
    });
  }
}
