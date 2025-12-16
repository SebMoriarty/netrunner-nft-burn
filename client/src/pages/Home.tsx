import { useState, useCallback } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import NFTGrid from "@/components/NFTGrid";
import SelectionSummary from "@/components/SelectionSummary";
import UserInfoForm from "@/components/UserInfoForm";
import TransactionModal from "@/components/TransactionModal";
import ConfirmationScreen from "@/components/ConfirmationScreen";
import Footer from "@/components/Footer";
import type { NFT } from "@/components/NFTCard";
import { useToast } from "@/hooks/use-toast";

type AppState = "disconnected" | "loading" | "selecting" | "form" | "transaction" | "confirmation";
type TxStatus = "preparing" | "signing" | "processing" | "error";

const MAX_SELECTION = 10;
const DISCOUNT_PER_NFT = 3;

// todo: remove mock functionality
const MOCK_NFTS: NFT[] = Array.from({ length: 8 }, (_, i) => ({
  id: String(i + 1),
  mint: `DphFDYiifJ5NBCYXqsYVuDEynFTc2dASCRJeHQ4B4cNn`,
  name: `Netrunner #${1337 + i}`,
  image: `https://placehold.co/400x400/1a1a2e/00d9ff?text=NFT${i + 1}`,
}));

export default function Home() {
  const { toast } = useToast();
  const [appState, setAppState] = useState<AppState>("disconnected");
  const [walletAddress, setWalletAddress] = useState<string | undefined>();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [selectedNFTs, setSelectedNFTs] = useState<NFT[]>([]);
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(false);
  const [txStatus, setTxStatus] = useState<TxStatus>("preparing");
  const [txError, setTxError] = useState<string | undefined>();
  const [txSignature, setTxSignature] = useState<string>("");
  const [codeStatus, setCodeStatus] = useState<"pending" | "processing" | "sent">("pending");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const discountPercent = Math.min(selectedNFTs.length * DISCOUNT_PER_NFT, 30);

  // todo: replace with actual wallet connection
  const handleConnectWallet = useCallback(() => {
    setAppState("loading");
    setIsLoadingNFTs(true);

    setTimeout(() => {
      setWalletAddress("J6wu13dKzy2PU7qQbmxkjauf8NtysUMfmVSdN36V95Mx");
      setNfts(MOCK_NFTS);
      setIsLoadingNFTs(false);
      setAppState("selecting");
    }, 1500);
  }, []);

  const handleDisconnectWallet = useCallback(() => {
    setWalletAddress(undefined);
    setNfts([]);
    setSelectedNFTs([]);
    setAppState("disconnected");
  }, []);

  const handleToggleNFT = useCallback((nft: NFT) => {
    setSelectedNFTs((prev) => {
      const isSelected = prev.some((n) => n.id === nft.id);
      if (isSelected) {
        return prev.filter((n) => n.id !== nft.id);
      }
      if (prev.length >= MAX_SELECTION) {
        toast({
          title: "Maximum selection reached",
          description: `You can select up to ${MAX_SELECTION} NFTs.`,
          variant: "destructive",
        });
        return prev;
      }
      return [...prev, nft];
    });
  }, [toast]);

  const handleContinue = useCallback(() => {
    if (selectedNFTs.length === 0) return;
    setAppState("form");
  }, [selectedNFTs.length]);

  const handleBack = useCallback(() => {
    setAppState("selecting");
  }, []);

  // todo: replace with actual transaction logic
  const handleSubmit = useCallback(async (data: { email: string; discord: string }) => {
    setIsSubmitting(true);
    setAppState("transaction");
    setTxStatus("preparing");
    setTxError(undefined);

    try {
      await new Promise((r) => setTimeout(r, 1000));
      setTxStatus("signing");

      await new Promise((r) => setTimeout(r, 2000));
      setTxStatus("processing");

      await new Promise((r) => setTimeout(r, 1500));

      const mockSignature = "5wHu1qwD7HXiQ7NTBZPy6RVYJYmBqKYFnJ8RbLpKQqEpN7MkHNqCXmv9kgYvJZ3xgfNqYpUWJSGJ5QkPvYQPZ1Hk";
      setTxSignature(mockSignature);
      setCodeStatus("pending");
      setAppState("confirmation");

      console.log("Form data:", data);
      console.log("Selected NFTs:", selectedNFTs);
    } catch (error) {
      setTxStatus("error");
      setTxError(error instanceof Error ? error.message : "Transaction failed");
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedNFTs]);

  const handleCancelTransaction = useCallback(() => {
    setAppState("form");
    setIsSubmitting(false);
  }, []);

  const handleRetryTransaction = useCallback(() => {
    setTxStatus("preparing");
    setTxError(undefined);
  }, []);

  const handleCheckStatus = useCallback(() => {
    toast({
      title: "Checking status...",
      description: "Fetching the latest status from the server.",
    });
    setTimeout(() => {
      setCodeStatus("sent");
      toast({
        title: "Status updated",
        description: "Your discount code has been sent to your email!",
      });
    }, 1000);
  }, [toast]);

  const handleBurnMore = useCallback(() => {
    setSelectedNFTs([]);
    setTxSignature("");
    setCodeStatus("pending");
    setAppState("selecting");
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        walletAddress={walletAddress}
        isConnecting={appState === "loading" && !walletAddress}
        onConnectWallet={handleConnectWallet}
        onDisconnectWallet={handleDisconnectWallet}
      />

      <main className="flex-1">
        {appState === "disconnected" && (
          <HeroSection
            onConnectWallet={handleConnectWallet}
            isConnecting={false}
          />
        )}

        {(appState === "loading" || appState === "selecting") && (
          <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-2">Your Eligible NFTs</h2>
              <p className="text-muted-foreground">
                Select up to {MAX_SELECTION} NFTs to burn. Each NFT earns you {DISCOUNT_PER_NFT}% off.
              </p>
            </div>

            <NFTGrid
              nfts={nfts}
              selectedNFTs={selectedNFTs}
              maxSelection={MAX_SELECTION}
              isLoading={isLoadingNFTs}
              onToggleNFT={handleToggleNFT}
            />
          </div>
        )}

        {appState === "form" && (
          <div className="mx-auto max-w-6xl px-4 py-8">
            <UserInfoForm
              selectedNFTs={selectedNFTs}
              discountPercent={discountPercent}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
              onBack={handleBack}
            />
          </div>
        )}

        {appState === "confirmation" && (
          <div className="mx-auto max-w-6xl px-4 py-8">
            <ConfirmationScreen
              txSignature={txSignature}
              burnCount={selectedNFTs.length}
              discountPercent={discountPercent}
              codeStatus={codeStatus}
              onBurnMore={handleBurnMore}
              onCheckStatus={handleCheckStatus}
            />
          </div>
        )}
      </main>

      {(appState === "loading" || appState === "selecting") && selectedNFTs.length > 0 && (
        <SelectionSummary
          selectedCount={selectedNFTs.length}
          maxSelection={MAX_SELECTION}
          discountPercent={discountPercent}
          onContinue={handleContinue}
        />
      )}

      <TransactionModal
        isOpen={appState === "transaction"}
        status={txStatus}
        errorMessage={txError}
        onCancel={handleCancelTransaction}
        onRetry={handleRetryTransaction}
      />

      <Footer />
    </div>
  );
}
