import Home from "@/pages/Home";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

export default function HomeExample() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Home />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
