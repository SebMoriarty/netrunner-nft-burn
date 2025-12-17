import { CheckCircle, Copy, ExternalLink, Flame, RefreshCw, Mail, User, Home } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface ConfirmationScreenProps {
  txSignature: string;
  burnCount: number;
  discountPercent: number;
  codeStatus: "pending" | "processing" | "sent";
  onCheckStatus: () => void;
}

export default function ConfirmationScreen({
  txSignature,
  burnCount,
  discountPercent,
  codeStatus,
  onCheckStatus,
}: ConfirmationScreenProps) {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Transaction signature copied to clipboard.",
    });
  };

  const truncateSignature = (sig: string) => {
    return `${sig.slice(0, 12)}...${sig.slice(-12)}`;
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-8">
      <div className="max-w-lg w-full text-center">
        <div className="mx-auto h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6"
          style={{ boxShadow: '0 0 30px rgba(82, 224, 186, 0.2)' }}>
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>

        <h2 className="text-2xl font-bold mb-2">NFTs Burned Successfully!</h2>
        <p className="text-muted-foreground mb-8">
          Your transaction has been confirmed on the Solana network.
        </p>

        <Card className="p-6 text-left mb-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">NFTs Burned</span>
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-primary" />
                <span className="font-semibold">{burnCount}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Your Discount</span>
              <span className="text-2xl font-bold text-primary">{discountPercent}%</span>
            </div>

            <div className="pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground block mb-2">
                Transaction Signature
              </span>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm font-mono bg-muted px-3 py-2 rounded-lg truncate">
                  {truncateSignature(txSignature)}
                </code>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => copyToClipboard(txSignature)}
                  data-testid="button-copy-sig"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  asChild
                  data-testid="button-view-explorer"
                >
                  <a
                    href={`https://explorer.solana.com/tx/${txSignature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Discount Code Delivery</span>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 mb-4">
                <p className="text-sm text-muted-foreground">
                  {codeStatus === "sent" 
                    ? "Your discount code has been sent to your email! Check your inbox (and spam folder)."
                    : "Your discount code will be sent to your email once verification is complete. You can safely close this page and return later."}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Badge
                  variant={codeStatus === "sent" ? "default" : "secondary"}
                  className="px-3"
                >
                  {codeStatus === "pending" && "Pending Verification"}
                  {codeStatus === "processing" && "Processing..."}
                  {codeStatus === "sent" && "Code Sent"}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCheckStatus}
                  data-testid="button-check-status"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Check Status
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild data-testid="button-view-profile">
            <Link href="/profile">
              <User className="h-4 w-4 mr-2" />
              View Your Profile
            </Link>
          </Button>
          <Button variant="ghost" asChild data-testid="button-return-home">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
