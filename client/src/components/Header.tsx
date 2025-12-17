import { Wallet, Home } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import netrunnerLogo from "@assets/Logo_-_Bright_Netrunner_copy_1765940751964.png";

interface HeaderProps {
  walletAddress?: string;
  isConnecting?: boolean;
  onConnectWallet: () => void;
  onDisconnectWallet?: () => void;
}

export default function Header({
  walletAddress,
  isConnecting = false,
  onConnectWallet,
  onDisconnectWallet,
}: HeaderProps) {
  const [location] = useLocation();
  const isHome = location === "/";

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/" data-testid="link-logo-home">
            <img 
              src={netrunnerLogo} 
              alt="Netrunner" 
              className="h-10 w-10 cursor-pointer hover:opacity-80 transition-opacity" 
            />
          </Link>
          
          {!isHome && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" data-testid="link-nav-home">
                <Home className="h-4 w-4 mr-1" />
                Home
              </Link>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {walletAddress ? (
            <Button
              variant="outline"
              onClick={onDisconnectWallet}
              className="flex items-center gap-2 border-primary/30"
              style={{ 
                boxShadow: '0 0 12px rgba(82, 224, 186, 0.15), 0 2px 4px rgba(0,0,0,0.1)' 
              }}
              data-testid="button-disconnect-wallet"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-sm">
                {truncateAddress(walletAddress)}
              </span>
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={onConnectWallet}
              disabled={isConnecting}
              data-testid="button-connect-wallet"
            >
              <Wallet className="h-4 w-4 mr-2" />
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
