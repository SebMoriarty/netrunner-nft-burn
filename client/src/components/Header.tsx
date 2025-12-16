import { Wallet, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">NETRUNNER</span>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs font-mono">
            Solana Mainnet
          </Badge>

          {walletAddress ? (
            <Button
              variant="outline"
              onClick={onDisconnectWallet}
              className="flex items-center gap-2"
              data-testid="button-disconnect-wallet"
            >
              <span className="h-2 w-2 rounded-full bg-status-online" />
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
