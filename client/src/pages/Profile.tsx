import { Copy, ExternalLink, Flame, Wallet } from "lucide-react";
import { Link } from "wouter";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { BurnRequest } from "@shared/schema";

export default function Profile() {
  const { toast } = useToast();
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  const walletAddress = publicKey?.toBase58();

  const { data: burnHistory = [], isLoading } = useQuery<BurnRequest[]>({
    queryKey: ["/api/burn-history", walletAddress],
    enabled: !!walletAddress,
  });

  const handleConnectWallet = () => {
    setVisible(true);
  };

  const handleDisconnectWallet = () => {
    disconnect();
  };

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
        isConnecting={false}
        onConnectWallet={handleConnectWallet}
        onDisconnectWallet={handleDisconnectWallet}
      />

      <main className="flex-1">
        <div className="px-4 md:px-8 lg:px-12 py-8 max-w-5xl">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold mb-2">Your Burn History</h1>
            <p className="text-muted-foreground">
              View all your past NFT burns and earned discounts.
            </p>
          </div>

          {!connected ? (
            <Card className="p-8 text-center">
              <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2">Connect Your Wallet</h3>
              <p className="text-muted-foreground mb-4">
                Connect your wallet to view your burn history and earned discounts.
              </p>
              <Button onClick={handleConnectWallet} data-testid="button-connect-profile">
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            </Card>
          ) : isLoading ? (
            <>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            </>
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
                            <div className="font-medium">{formatDate(record.createdAt.toString())}</div>
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
                          <div>
                            <div className="text-sm text-muted-foreground">Status</div>
                            <Badge variant={record.status === "verified" ? "default" : "secondary"}>
                              {record.status}
                            </Badge>
                          </div>
                        </div>

                        {record.txSignature && (
                          <div className="flex items-center gap-2">
                            <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                              {truncateSignature(record.txSignature)}
                            </code>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => copyToClipboard(record.txSignature!)}
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
                        )}
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
