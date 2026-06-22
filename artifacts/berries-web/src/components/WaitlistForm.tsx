import { useState } from "react";
import { motion } from "framer-motion";
import { useJoinWaitlist, useGetWaitlistCount, getGetWaitlistCountQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const joinWaitlist = useJoinWaitlist();
  const { data: waitlistData } = useGetWaitlistCount();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    joinWaitlist.mutate({ data: { email } }, {
      onSuccess: () => {
        toast({
          title: "You're on the list!",
          description: "We'll let you know when the next drop happens.",
        });
        setEmail("");
        queryClient.invalidateQueries({ queryKey: getGetWaitlistCountQueryKey() });
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Uh oh",
          description: "Something went wrong. Try again?",
        });
      }
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 w-full mb-3">
        <input
          type="email"
          placeholder="ENTER YOUR EMAIL"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-4 bg-white border-4 border-foreground text-foreground font-mono font-bold placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/20"
          required
        />
        <button
          type="submit"
          disabled={joinWaitlist.isPending}
          className="px-8 py-4 bg-accent text-accent-foreground font-bold uppercase tracking-widest border-4 border-foreground shadow-[6px_6px_0px_0px_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
        >
          {joinWaitlist.isPending ? <Loader2 className="animate-spin w-6 h-6" /> : "JOIN NOW"}
        </button>
      </form>
      {waitlistData && waitlistData.count > 0 && (
        <p className="font-mono text-sm font-bold text-muted-foreground text-center">
          Join <span className="text-foreground">{waitlistData.count.toLocaleString()}</span> other berries on the waitlist!
        </p>
      )}
    </div>
  );
}
