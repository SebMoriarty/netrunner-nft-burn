import { Wallet, Flame, Percent, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import netroMascot from "@assets/NETRO_FIGMA_2_1765856868214.png";

interface HeroSectionProps {
  onConnectWallet: () => void;
  isConnecting?: boolean;
}

export default function HeroSection({
  onConnectWallet,
  isConnecting = false,
}: HeroSectionProps) {
  return (
    <div className="relative min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: `linear-gradient(45deg, hsl(161 70% 60% / 0.1) 1px, transparent 1px),
                          linear-gradient(-45deg, hsl(161 70% 60% / 0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />
      
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          <div className="text-center lg:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Flame className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">NFT Burn Program</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Burn NFTs, Claim Discounts
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Earn up to <span className="text-primary font-semibold">30% off</span> by burning eligible NFTs. 
              Each NFT burned unlocks <span className="text-primary font-semibold">3% discount</span>, 
              stack up to 10 for maximum savings.
            </p>

            <Button
              size="lg"
              onClick={onConnectWallet}
              disabled={isConnecting}
              className="text-base px-8"
              data-testid="button-hero-connect"
            >
              <Wallet className="h-5 w-5 mr-2" />
              {isConnecting ? "Connecting..." : "Connect Wallet to Start"}
            </Button>
          </div>

          <div className="relative flex-shrink-0 hidden md:block">
            <img 
              src={netroMascot} 
              alt="Netro mascot" 
              className="h-64 lg:h-80 w-auto object-contain"
              style={{ filter: 'drop-shadow(0 0 20px rgba(82, 224, 186, 0.3))' }}
            />
          </div>
        </div>

        <div className="md:hidden flex justify-center mt-8">
          <img 
            src={netroMascot} 
            alt="Netro mascot" 
            className="h-40 w-auto object-contain"
            style={{ filter: 'drop-shadow(0 0 15px rgba(82, 224, 186, 0.3))' }}
          />
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 w-full max-w-3xl">
        <Card className="p-6 text-center">
          <Flame className="h-8 w-8 mx-auto mb-3 text-primary" />
          <div className="text-2xl font-bold">2,847</div>
          <div className="text-sm text-muted-foreground">Total Burns</div>
        </Card>
        <Card className="p-6 text-center">
          <Percent className="h-8 w-8 mx-auto mb-3 text-primary" />
          <div className="text-2xl font-bold">1,203</div>
          <div className="text-sm text-muted-foreground">Discounts Claimed</div>
        </Card>
        <Card className="p-6 text-center">
          <Zap className="h-8 w-8 mx-auto mb-3 text-primary" />
          <div className="text-2xl font-bold">589</div>
          <div className="text-sm text-muted-foreground">Active Burners</div>
        </Card>
      </div>
    </div>
  );
}
