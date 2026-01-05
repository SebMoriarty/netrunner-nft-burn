import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import netroMascot from "@assets/NETRO_FIGMA_2_1765856868214.png";

interface HeroSectionProps {
  onGetStarted: () => void;
}

function BlinkingMascot({ className, imgClassName }: { className?: string; imgClassName?: string }) {
  const [isBlinking, setIsBlinking] = useState(false);
  const blinkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reopenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;

    const scheduleBlink = () => {
      const delay = 3000 + Math.random() * 2000;
      blinkTimerRef.current = setTimeout(() => {
        if (!mounted) return;
        setIsBlinking(true);
        reopenTimerRef.current = setTimeout(() => {
          if (!mounted) return;
          setIsBlinking(false);
          scheduleBlink();
        }, 200);
      }, delay);
    };

    scheduleBlink();

    return () => {
      mounted = false;
      if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current);
      if (reopenTimerRef.current) clearTimeout(reopenTimerRef.current);
    };
  }, []);

  return (
    <div className={`relative ${className || ''}`}>
      <img 
        src={netroMascot} 
        alt="Netro mascot" 
        className={imgClassName}
        style={{ filter: 'drop-shadow(0 0 40px rgba(0, 180, 140, 0.25))' }}
      />
      <div 
        className="absolute pointer-events-none transition-opacity duration-75"
        style={{
          top: '28%',
          left: '32%',
          width: '36%',
          height: '8%',
          backgroundColor: 'hsl(164 20% 12%)',
          opacity: isBlinking ? 1 : 0,
          borderRadius: '2px',
        }}
      />
    </div>
  );
}

export default function HeroSection({
  onGetStarted,
}: HeroSectionProps) {

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center px-6 md:px-10 py-12">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, hsl(164 80% 45% / 0.15) 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} />
      
      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
          <div className="text-center lg:text-left flex-1 max-w-xl">
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

          <div className="flex-shrink-0 hidden lg:block">
            <BlinkingMascot 
              imgClassName="h-64 xl:h-80 w-auto object-contain"
            />
          </div>
        </div>

        <div className="lg:hidden flex justify-center mt-8">
          <BlinkingMascot 
            imgClassName="h-44 w-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}
