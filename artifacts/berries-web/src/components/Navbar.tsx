import { motion } from "framer-motion";
import { Link } from "wouter";
import { useClerk } from "@clerk/react";

export function Navbar() {
  const { user } = useClerk();
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b-4 border-foreground p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img src={`${import.meta.env.BASE_URL.replace(/\/$/, "")}/logo.svg`} alt="Berries Logo" className="w-10 h-10 hover:rotate-12 transition-transform" />
          <span className="text-2xl font-bold uppercase tracking-tighter text-primary">BERRIES</span>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/dashboard" className="px-6 py-2 bg-secondary text-foreground font-bold uppercase border-2 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_hsl(var(--foreground))] transition-all">
              Dashboard
            </Link>
          ) : (
            <Link href="/sign-in" className="px-6 py-2 bg-primary text-primary-foreground font-bold uppercase border-2 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_hsl(var(--foreground))] transition-all">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
