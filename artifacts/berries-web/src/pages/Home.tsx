import { Navbar } from "@/components/Navbar";
import { WaitlistForm } from "@/components/WaitlistForm";
import { StatsPanel } from "@/components/StatsPanel";
import { Roadmap } from "@/components/Roadmap";
import { motion } from "framer-motion";
import heroImg from "@/assets/hero-berry.png";
import { useHealthCheck } from "@workspace/api-client-react";

export default function Home() {
  const { data: health } = useHealthCheck();

  return (
    <div className="min-h-[100dvh] bg-background text-foreground selection:bg-primary selection:text-white">
      <Navbar />
      
      <main className="pt-24">
        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b-4 border-foreground">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_center,_hsl(var(--foreground))_2px,_transparent_2px)] [background-size:24px_24px]"></div>
          
          <div className="max-w-7xl mx-auto px-4 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 py-12">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col gap-6"
            >
              <div className="inline-block px-4 py-1 border-2 border-foreground bg-secondary w-fit font-bold uppercase tracking-widest text-sm shadow-[2px_2px_0px_0px_hsl(var(--foreground))]">
                Solana Meme Season
              </div>
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                Get Your <span className="text-primary block transform -rotate-2 origin-left mt-2">$BERRIES</span>
              </h1>
              <p className="text-xl md:text-2xl font-mono text-muted-foreground font-bold mt-4 max-w-lg">
                A chaotic farmers market on the blockchain. Sweet, punchy, and wildly volatile.
              </p>
              
              <div className="mt-8">
                <WaitlistForm />
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "backOut" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-accent translate-x-4 translate-y-4 border-4 border-foreground" />
              <img 
                src={heroImg} 
                alt="Berries Hero Character" 
                className="relative z-10 w-full h-auto object-cover border-4 border-foreground bg-white"
              />
            </motion.div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="py-24 px-4 bg-white border-b-4 border-foreground">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">The Patch Is Growing</h2>
            </div>
            <StatsPanel />
          </motion.div>
        </section>

        {/* ROADMAP SECTION */}
        <section className="py-24 px-4 bg-background border-b-4 border-foreground">
          <Roadmap />
        </section>
      </main>

      <footer className="bg-foreground text-background py-12 px-4 border-t-8 border-primary">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src={`${import.meta.env.BASE_URL.replace(/\/$/, "")}/logo.svg`} alt="Berries" className="w-8 h-8 grayscale invert" />
            <span className="text-2xl font-black uppercase tracking-tighter">$BERRY</span>
          </div>
          <div className="flex flex-col items-end gap-2">
            <p className="font-mono font-bold text-sm text-background/60">
              NOT FINANCIAL ADVICE. WE'RE LITERALLY BERRIES.
            </p>
            {health && (
              <span className="text-xs font-mono font-bold text-background/40 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary"></span> API {health.status}
              </span>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}