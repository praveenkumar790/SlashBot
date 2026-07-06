'use server';

import { mirrorInteraction } from '@/lib/mirror';
import { revalidatePath } from 'next/cache';

/**
 * Server Action to retry webhook mirroring for a specific list of interaction IDs.
 */
export async function retrySelectedInteractions(ids: string[]) {
  if (!ids || ids.length === 0) return { success: false, count: 0 };

  // Trigger mirror mirroring for each selected interaction ID.
  // We can do this in parallel.
  const promises = ids.map((id) => mirrorInteraction(id));
  await Promise.all(promises);

  revalidatePath('/dashboard');
  return { success: true, count: ids.length };
}
