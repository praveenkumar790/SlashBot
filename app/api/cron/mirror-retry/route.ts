import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { mirrorInteraction } from '@/lib/mirror';
import { waitUntil } from '@vercel/functions';

export async function GET(req: Request) {
  // Security: Vercel CRON headers check
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    // If we're testing locally, we might not have a CRON_SECRET, but in prod we should enforce it.
    if (process.env.NODE_ENV === 'production') {
      return new NextResponse('Unauthorized', { status: 401 });
    }
  }

  try {
    // Find interactions that are 'pending' or 'failed' and under max retries
    const failedInteractions = await prisma.interaction.findMany({
      where: {
        commandName: 'report',
        mirrorStatus: { in: ['pending', 'failed'] },
        mirrorRetries: { lt: 3 } // Retry up to 3 times
      },
      take: 20 // Process in batches
    });

    for (const interaction of failedInteractions) {
      // Trigger them all via waitUntil so they run concurrently in the background
      waitUntil(mirrorInteraction(interaction.id));
    }

    return NextResponse.json({ 
      success: true, 
      count: failedInteractions.length,
      message: `Triggered retries for ${failedInteractions.length} interactions` 
    });

  } catch (error: any) {
    console.error('Cron mirror retry failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
