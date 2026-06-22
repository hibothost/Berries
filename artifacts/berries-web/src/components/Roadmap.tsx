import { motion } from "framer-motion";

const PHASES = [
  {
    num: 1,
    title: "Berry Drop",
    status: "COMPLETE",
    items: ["Token launch", "Community formation", "Website & socials"]
  },
  {
    num: 2,
    title: "Berry Patch",
    status: "IN PROGRESS",
    items: ["CEX listings", "10k holders", "Influencer campaigns"]
  },
  {
    num: 3,
    title: "Berry Bloom",
    status: "UPCOMING",
    items: ["NFT collection drop", "Staking rewards", "DAO formation"]
  },
  {
    num: 4,
    title: "Berry World",
    status: "UPCOMING",
    items: ["Cross-chain bridge", "Mobile app launch", "IRL events"]
  }
];

export function Roadmap({ progress = 0 }: { progress?: number }) {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="mb-12">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-foreground">Roadmap</h2>
          {progress > 0 && <span className="text-xl font-bold font-mono">{progress}% Complete</span>}
        </div>
        {progress > 0 && (
          <div className="h-4 w-full bg-muted border-2 border-foreground relative overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute top-0 left-0 bottom-0 bg-primary border-r-2 border-foreground"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {PHASES.map((phase, i) => (
          <motion.div 
            key={phase.num}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 border-4 border-foreground shadow-[8px_8px_0px_0px_hsl(var(--foreground))] ${
              phase.status === "COMPLETE" ? "bg-secondary/40" : 
              phase.status === "IN PROGRESS" ? "bg-primary/20" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-start mb-6 border-b-4 border-foreground pb-4">
              <div>
                <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground block mb-1">Phase {phase.num}</span>
                <h3 className="text-2xl font-black uppercase tracking-tight">{phase.title}</h3>
              </div>
              <span className={`px-3 py-1 text-xs font-bold uppercase tracking-widest border-2 border-foreground ${
                phase.status === "COMPLETE" ? "bg-secondary text-foreground" :
                phase.status === "IN PROGRESS" ? "bg-primary text-primary-foreground animate-pulse" :
                "bg-muted text-muted-foreground"
              }`}>
                {phase.status}
              </span>
            </div>
            <ul className="space-y-3">
              {phase.items.map((item, j) => (
                <li key={j} className="flex items-start gap-3 font-mono text-sm md:text-base font-bold">
                  <span className="text-primary mt-1">▹</span> {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}