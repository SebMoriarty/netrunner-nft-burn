"use client";

import { Wallet, Home, CheckCircle, FileText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

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
  const pathname = usePathname();
  const isHome = pathname === "/";

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
              src="/netrunner-logo.png"
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
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground border border-border rounded-full px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Solana Mainnet
          </span>
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
