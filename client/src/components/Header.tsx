import { Wallet, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import netrunnerLogo from "@assets/Logo_-_Bright_Netrunner_copy_1765940751964.png";

interface HeaderProps {
  walletAddress?: string;
  isConnecting?: boolean;
  onConnectWallet: () => void;
  onDisconnectWallet?: () => void;
  showBack?: boolean;
  onBack?: () => void;
}

export default function Header({
  walletAddress,
  isConnecting = false,
  onConnectWallet,
  onDisconnectWallet,
  showBack = false,
  onBack,
}: HeaderProps) {
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {showBack && onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="mr-2"
              data-testid="button-header-back"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Home
            </Button>
          )}
          <img src={netrunnerLogo} alt="Netrunner" className="h-12 w-12" />
        </div>

        <div className="flex items-center gap-3">
          {walletAddress ? (
            <Button
              variant="outline"
              onClick={onDisconnectWallet}
              className="flex items-center gap-2 shadow-sm shadow-primary/20 border-primary/30 hover:border-primary/50"
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
