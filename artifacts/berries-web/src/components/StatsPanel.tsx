import { useGetCoinStats } from "@workspace/api-client-react";

export function StatsPanel() {
  const { data: stats, isLoading } = useGetCoinStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-muted border-4 border-foreground rounded-none shadow-[4px_4px_0px_0px_hsl(var(--foreground))]"></div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mx-auto">
      <StatCard title="Total Holders" value={stats.totalHolders.toLocaleString()} color="bg-primary" />
      <StatCard title="Waitlist Size" value={stats.waitlistCount.toLocaleString()} color="bg-secondary" />
      <StatCard title="Connected Wallets" value={stats.totalWallets.toLocaleString()} color="bg-accent" />
    </div>
  );
}

function StatCard({ title, value, color }: { title: string, value: string, color: string }) {
  return (
    <div className={`${color} p-6 border-4 border-foreground shadow-[8px_8px_0px_0px_hsl(var(--foreground))] transform transition-transform hover:-translate-y-2`}>
      <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/80 mb-2">{title}</h3>
      <p className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">{value}</p>
    </div>
  );
}