import { Navbar } from "@/components/Navbar";
import { Roadmap } from "@/components/Roadmap";
import { useClerk, useUser } from "@clerk/react";
import { 
  useGetCoinStats, 
  useGetUserWallets, 
  useConnectWallet,
  getGetUserWalletsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { toast } = useToast();
  const queryClientLocal = useQueryClient();
  
  const { data: stats, isLoading: statsLoading } = useGetCoinStats();
  const { data: wallets, isLoading: walletsLoading } = useGetUserWallets();
  const connectWallet = useConnectWallet();

  const handleConnectPhantom = async () => {
    try {
      const provider = (window as any).solana;
      if (!provider?.isPhantom) {
        window.open('https://phantom.app/', '_blank');
        return;
      }
      
      const resp = await provider.connect();
      const address = resp.publicKey.toString();
      
      connectWallet.mutate({ data: { address, provider: 'phantom' } }, {
        onSuccess: () => {
          toast({
            title: "Wallet Connected!",
            description: "Your Phantom wallet is now linked.",
          });
          queryClientLocal.invalidateQueries({ queryKey: getGetUserWalletsQueryKey() });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Connection Failed",
            description: "Could not register wallet. Try again.",
          });
        }
      });
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "Failed to connect to Phantom.",
      });
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <Navbar />
      
      <main className="pt-32 pb-24 px-4 max-w-6xl mx-auto space-y-16">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-4 border-foreground pb-8">
          <div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">Your Patch</h1>
            <p className="text-xl font-mono font-bold text-muted-foreground mt-2">
              Welcome back, {user?.primaryEmailAddress?.emailAddress || 'Berry fren'}
            </p>
          </div>
          <button 
            onClick={() => signOut({ redirectUrl: "/" })}
            className="px-6 py-2 bg-white text-foreground font-bold uppercase border-2 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_hsl(var(--foreground))] transition-all"
          >
            Log Out
          </button>
        </header>

        {/* WALLET & HOLDINGS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* MOCK HOLDINGS */}
          <section className="bg-primary p-8 border-4 border-foreground shadow-[8px_8px_0px_0px_hsl(var(--foreground))]">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary-foreground/80 mb-2">Estimated Balance</h2>
            <div className="text-6xl md:text-8xl font-black tracking-tighter text-primary-foreground mb-4">
              420.69k
            </div>
            <p className="font-mono font-bold text-primary-foreground/90 bg-foreground/10 px-4 py-2 inline-block border-2 border-primary-foreground/20">
              $BERRY
            </p>
          </section>

          {/* WALLET CONNECTION */}
          <section className="bg-white p-8 border-4 border-foreground shadow-[8px_8px_0px_0px_hsl(var(--foreground))]">
            <h2 className="text-2xl font-black uppercase tracking-tight mb-6 pb-4 border-b-4 border-foreground">Connected Wallets</h2>
            
            {walletsLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : wallets && wallets.length > 0 ? (
              <ul className="space-y-4 mb-8">
                {wallets.map(w => (
                  <li key={w.id} className="p-4 bg-muted border-2 border-foreground flex justify-between items-center">
                    <span className="font-mono font-bold text-sm truncate max-w-[200px]">{w.address}</span>
                    <span className="px-2 py-1 text-xs font-bold uppercase bg-foreground text-background">{w.provider}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center p-8 bg-muted border-2 border-dashed border-foreground mb-8">
                <p className="font-mono font-bold text-muted-foreground">No wallets connected yet.</p>
              </div>
            )}
            
            <button
              onClick={handleConnectPhantom}
              disabled={connectWallet.isPending}
              className="w-full px-6 py-4 bg-accent text-accent-foreground font-bold uppercase text-lg border-4 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_hsl(var(--foreground))] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {connectWallet.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "Connect Phantom Wallet"}
            </button>
          </section>
        </div>

        {/* ROADMAP PROGRESS */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-black uppercase tracking-tight">Project Status</h2>
          </div>
          {statsLoading ? (
            <div className="h-64 bg-muted animate-pulse border-4 border-foreground"></div>
          ) : (
            <Roadmap progress={stats?.roadmapProgress} />
          )}
        </section>

      </main>
    </div>
  );
}