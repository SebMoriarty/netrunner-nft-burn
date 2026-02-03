import { Wallet, Home, CheckCircle, FileText } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import netrunnerLogo from "@assets/Logo_-_Bright_Netrunner_copy_1765940751964.png";

interface HeaderProps {
  walletAddress?: string;
  isConnecting?: boolean;
  onConnectWallet: () => void;
  onDisconnectWallet?: () => void;
  onLogoClick?: () => void;
}

export default function Header({
  walletAddress,
  isConnecting = false,
  onConnectWallet,
  onDisconnectWallet,
  onLogoClick,
}: HeaderProps) {
  const [location] = useLocation();
  const isHome = location === "/";

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (onLogoClick) {
      e.preventDefault();
      onLogoClick();
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/98 backdrop-blur-sm">
      <div className="px-4 md:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" data-testid="link-logo-home" className="flex items-center gap-2.5" onClick={handleLogoClick}>
            <img 
              src={netrunnerLogo} 
              alt="Netrunner" 
              className="h-7 w-7 cursor-pointer" 
            />
            <span className="text-lg font-semibold tracking-tight hidden sm:inline">Netrunner</span>
          </Link>
          
          {!isHome && (
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
              <Link href="/" data-testid="link-nav-home">
                <Home className="h-4 w-4 mr-1.5" />
                Home
              </Link>
            </Button>
          )}
          
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
            <Link href="/docs" data-testid="link-nav-docs">
              <FileText className="h-4 w-4 mr-1.5" />
              How it works
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-3">
          {walletAddress ? (
            <Button
              variant="secondary"
              onClick={onDisconnectWallet}
              className="flex items-center gap-2"
              data-testid="button-disconnect-wallet"
            >
              <CheckCircle className="h-3.5 w-3.5 text-primary" />
              <span className="font-mono text-sm">
                {truncateAddress(walletAddress)}
              </span>
            </Button>
          ) : (
            <Button
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
