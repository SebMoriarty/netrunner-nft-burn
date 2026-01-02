import { ArrowRight, Flame, Percent, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import netroMascot from "@assets/NETRO_FIGMA_2_1765856868214.png";

interface HeroSectionProps {
  onGetStarted: () => void;
}

interface BurnStats {
  totalBurns: number;
  discountsClaimed: number;
  activeBurners: number;
}

export default function HeroSection({
  onGetStarted,
}: HeroSectionProps) {
  const { data: stats } = useQuery<BurnStats>({
    queryKey: ['/api/stats'],
    refetchInterval: 30000,
  });

  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center px-6 md:px-10 py-16">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-primary/3 to-transparent pointer-events-none" />
      <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
        backgroundImage: `linear-gradient(45deg, hsl(161 70% 60% / 0.08) 1px, transparent 1px),
                          linear-gradient(-45deg, hsl(161 70% 60% / 0.08) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />
      
      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
          <div className="text-center lg:text-left flex-1 max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Flame className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">NFT Burn Program</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight">
              Burn NFTs,<br />Claim Discounts
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
              Earn up to <span className="text-primary font-semibold">30% off</span> by burning eligible NFTs. 
              Each NFT burned unlocks <span className="text-primary font-semibold">3% discount</span>, 
              stack up to 10 for maximum savings.
            </p>

            <Button
              onClick={onGetStarted}
              className="px-6"
              data-testid="button-get-started"
            >
              Get Started
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="relative flex-shrink-0 hidden lg:block">
            <img 
              src={netroMascot} 
              alt="Netro mascot" 
              className="h-72 xl:h-96 w-auto object-contain"
              style={{ filter: 'drop-shadow(0 0 30px rgba(82, 224, 186, 0.35))' }}
            />
          </div>
        </div>

        <div className="lg:hidden flex justify-center mt-10">
          <img 
            src={netroMascot} 
            alt="Netro mascot" 
            className="h-48 w-auto object-contain"
            style={{ filter: 'drop-shadow(0 0 20px rgba(82, 224, 186, 0.3))' }}
          />
        </div>
      </div>

      <div className="relative z-10 flex flex-wrap justify-center gap-6 md:gap-10 mt-20 pt-10 border-t border-border/30 w-full max-w-2xl">
        <div className="text-center opacity-70">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Flame className="h-4 w-4 text-primary/70" />
            <span className="text-xl font-semibold" data-testid="stat-total-burns">
              {stats?.totalBurns?.toLocaleString() ?? "0"}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">Total Burns</span>
        </div>
        <div className="text-center opacity-70">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Percent className="h-4 w-4 text-primary/70" />
            <span className="text-xl font-semibold" data-testid="stat-discounts-claimed">
              {stats?.discountsClaimed?.toLocaleString() ?? "0"}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">Discounts Claimed</span>
        </div>
        <div className="text-center opacity-70">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-primary/70" />
            <span className="text-xl font-semibold" data-testid="stat-active-burners">
              {stats?.activeBurners?.toLocaleString() ?? "0"}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">Active Burners</span>
        </div>
      </div>
    </div>
  );
}
