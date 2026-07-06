import { prisma } from '@/lib/db';
import { InteractionsTable } from '@/components/interactions-table';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const interactions = await prisma.interaction.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { server: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Recent Interactions</h2>
        <p className="text-foreground/60 mt-1">View the last 50 bot interactions across all servers. Click any row to view full details.</p>
      </div>

      <InteractionsTable initialInteractions={interactions} />
    </div>
  );
}
