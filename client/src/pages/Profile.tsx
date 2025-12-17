import { Copy, ExternalLink, Flame, Wallet } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useState, useCallback } from "react";

interface BurnRecord {
  id: string;
  date: string;
  nftCount: number;
  discountPercent: number;
  txSignature: string;
}

// todo: remove mock functionality
const MOCK_BURN_HISTORY: BurnRecord[] = [
  {
    id: "1",
    date: "2024-12-15",
    nftCount: 3,
    discountPercent: 9,
    txSignature: "5wHu1qwD7HXiQ7NTBZPy6RVYJYmBqKYFnJ8RbLpKQqEpN7MkHNqCXmv9kgYvJZ3xgfNqYpUWJSGJ5QkPvYQPZ1Hk",
  },
  {
    id: "2",
    date: "2024-12-10",
    nftCount: 5,
    discountPercent: 15,
    txSignature: "3xKp2mNq8HXiQ7NTBZPy6RVYJYmBqKYFnJ8RbLpKQqEpN7MkHNqCXmv9kgYvJZ3xgfNqYpUWJSGJ5QkPvYQAbCd",
  },
  {
    id: "3",
    date: "2024-12-01",
    nftCount: 2,
    discountPercent: 6,
    txSignature: "7mLq4rPs9HXiQ7NTBZPy6RVYJYmBqKYFnJ8RbLpKQqEpN7MkHNqCXmv9kgYvJZ3xgfNqYpUWJSGJ5QkPvYQEfGh",
  },
];

export default function Profile() {
  const { toast } = useToast();
  const [walletAddress, setWalletAddress] = useState<string | undefined>();
  const [isConnecting, setIsConnecting] = useState(false);

  // todo: replace with actual wallet connection
  const handleConnectWallet = useCallback(() => {
    if (walletAddress) return;
    setIsConnecting(true);
    setTimeout(() => {
      setWalletAddress("J6wu13dKzy2PU7qQbmxkjauf8NtysUMfmVSdN36V95Mx");
      setIsConnecting(false);
    }, 1000);
  }, [walletAddress]);

  const handleDisconnectWallet = useCallback(() => {
    setWalletAddress(undefined);
  }, []);

  const burnHistory = walletAddress ? MOCK_BURN_HISTORY : [];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Transaction signature copied to clipboard.",
    });
  };

  const truncateSignature = (sig: string) => {
    return `${sig.slice(0, 8)}...${sig.slice(-8)}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const totalNftsBurned = burnHistory.reduce((sum, record) => sum + record.nftCount, 0);
  const totalDiscountEarned = burnHistory.reduce((sum, record) => sum + record.discountPercent, 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        walletAddress={walletAddress}
        isConnecting={isConnecting}
        onConnectWallet={handleConnectWallet}
        onDisconnectWallet={handleDisconnectWallet}
      />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-6 md:px-10 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold mb-2">Your Burn History</h1>
            <p className="text-muted-foreground">
              View all your past NFT burns and earned discounts.
            </p>
          </div>

          {!walletAddress ? (
            <Card className="p-8 text-center">
              <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2">Connect Your Wallet</h3>
              <p className="text-muted-foreground mb-4">
                Connect your wallet to view your burn history and earned discounts.
              </p>
              <Button onClick={handleConnectWallet} disabled={isConnecting} data-testid="button-connect-profile">
                <Wallet className="h-4 w-4 mr-2" />
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Flame className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{totalNftsBurned}</div>
                      <div className="text-sm text-muted-foreground">Total NFTs Burned</div>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold">%</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{totalDiscountEarned}%</div>
                      <div className="text-sm text-muted-foreground">Total Discount Earned</div>
                    </div>
                  </div>
                </Card>
              </div>

              {burnHistory.length === 0 ? (
                <Card className="p-8 text-center">
                  <Flame className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium mb-2">No burns yet</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't burned any NFTs yet. Start burning to earn discounts!
                  </p>
                  <Button asChild>
                    <Link href="/" data-testid="link-start-burning">
                      Start Burning
                    </Link>
                  </Button>
                </Card>
              ) : (
                <div className="space-y-3">
                  {burnHistory.map((record) => (
                    <Card key={record.id} className="p-4" data-testid={`card-burn-${record.id}`}>
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-6">
                          <div>
                            <div className="text-sm text-muted-foreground">Date</div>
                            <div className="font-medium">{formatDate(record.date)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">NFTs Burned</div>
                            <div className="flex items-center gap-1">
                              <Flame className="h-4 w-4 text-primary" />
                              <span className="font-medium">{record.nftCount}</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Discount</div>
                            <Badge variant="secondary" className="font-mono">
                              {record.discountPercent}%
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                            {truncateSignature(record.txSignature)}
                          </code>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => copyToClipboard(record.txSignature)}
                            data-testid={`button-copy-${record.id}`}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            asChild
                            data-testid={`button-explorer-${record.id}`}
                          >
                            <a
                              href={`https://explorer.solana.com/tx/${record.txSignature}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
