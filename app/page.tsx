"use client";

import { useState, useCallback, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Connection } from "@solana/web3.js";
import bs58 from "bs58";
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
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { createNFTTransferTransaction } from "@/lib/nftTransfer";

const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_ENDPOINT || "https://api.mainnet-beta.solana.com";

type AppState = "home" | "selecting" | "loading" | "form" | "transaction" | "confirmation";
type TxStatus = "preparing" | "signing" | "processing" | "error";

const MAX_SELECTION = 10;
const DISCOUNT_PER_NFT = 3;


export default function Home() {
  const { toast } = useToast();
  const { publicKey, connected, disconnect, signTransaction, signMessage } = useWallet();
  const { setVisible } = useWalletModal();

  const [appState, setAppState] = useState<AppState>("home");
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [selectedNFTs, setSelectedNFTs] = useState<NFT[]>([]);
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(false);
  const [txStatus, setTxStatus] = useState<TxStatus>("preparing");
  const [txError, setTxError] = useState<string | undefined>();
  const [txSignature, setTxSignature] = useState<string>("");
  const [codeStatus, setCodeStatus] = useState<"pending" | "processing" | "sent">("pending");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [burnRequestId, setBurnRequestId] = useState<string>("");

  const walletAddress = publicKey?.toBase58();
  const discountPercent = Math.min(selectedNFTs.length * DISCOUNT_PER_NFT, 30);

  useEffect(() => {
    if (connected && walletAddress && appState === "selecting") {
      setIsLoadingNFTs(true);
      fetch(`/api/nfts/${walletAddress}`)
        .then(res => res.json())
        .then((data: NFT[]) => {
          setNfts(data);
          setIsLoadingNFTs(false);
        })
        .catch(err => {
          console.error("Failed to fetch NFTs:", err);
          setNfts([]);
          setIsLoadingNFTs(false);
          toast({
            title: "Failed to load NFTs",
            description: "Could not fetch your eligible NFTs. Please try again.",
            variant: "destructive",
          });
        });
    }
  }, [connected, walletAddress, appState, toast]);

  const handleGetStarted = useCallback(() => {
    setAppState("selecting");
  }, []);

  const handleConnectWallet = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  const handleDisconnectWallet = useCallback(() => {
    disconnect();
    setNfts([]);
    setSelectedNFTs([]);
    setAppState("home");
  }, [disconnect]);

  const handleGoHome = useCallback(() => {
    setAppState("home");
    setSelectedNFTs([]);
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

  const handleBackToSelection = useCallback(() => {
    setAppState("selecting");
  }, []);

  const handleSubmit = useCallback(async (data: { email: string; discord: string }) => {
    if (!walletAddress || !publicKey || !signTransaction || !signMessage) return;

    setIsSubmitting(true);
    setAppState("transaction");
    setTxStatus("preparing");
    setTxError(undefined);

    try {
      const nftMints = selectedNFTs.map(nft => nft.mint);

      // Create and sign a message to prove wallet ownership
      const timestamp = Date.now();
      const message = `Netrunner NFT Burn Request\nWallet: ${walletAddress}\nNFTs: ${nftMints.length}\nTimestamp: ${timestamp}`;
      const messageBytes = new TextEncoder().encode(message);
      const signatureBytes = await signMessage(messageBytes);
      const walletSignature = bs58.encode(signatureBytes);

      const response = await apiRequest("POST", "/api/burn-requests", {
        walletAddress,
        email: data.email,
        discord: data.discord,
        nftMints,
        signature: walletSignature,
        message,
      });

      const burnRequest = await response.json();
      setBurnRequestId(burnRequest.id);

      setTxStatus("signing");

      const connection = new Connection(RPC_ENDPOINT, "confirmed");
      const transaction = await createNFTTransferTransaction(
        connection,
        publicKey,
        nftMints
      );

      const signedTransaction = await signTransaction(transaction);

      setTxStatus("processing");

      const txSig = await connection.sendRawTransaction(
        signedTransaction.serialize(),
        { skipPreflight: false, preflightCommitment: "confirmed" }
      );

      await connection.confirmTransaction(txSig, "confirmed");

      await apiRequest("PATCH", `/api/burn-requests/${burnRequest.id}/transaction`, {
        txSignature: txSig,
      });

      setTxSignature(txSig);
      setCodeStatus("pending");
      setAppState("confirmation");
    } catch (error) {
      console.error("Transaction error:", error);
      setTxStatus("error");
      setTxError(error instanceof Error ? error.message : "Transaction failed");
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedNFTs, walletAddress, publicKey, signTransaction, signMessage]);

  const handleCancelTransaction = useCallback(() => {
    setAppState("form");
    setIsSubmitting(false);
  }, []);

  const handleRetryTransaction = useCallback(() => {
    setTxStatus("preparing");
    setTxError(undefined);
  }, []);

  const handleCheckStatus = useCallback(async () => {
    if (!burnRequestId) return;

    toast({
      title: "Checking status...",
      description: "Fetching the latest status from the server.",
    });

    try {
      const response = await fetch(`/api/burn-requests/${burnRequestId}`);
      const burnRequest = await response.json();

      if (burnRequest.status === "verified" && burnRequest.discountCode) {
        setCodeStatus("sent");
        toast({
          title: "Status updated",
          description: "Your discount code has been sent to your email!",
        });
      } else {
        toast({
          title: "Still processing",
          description: "Your burn is being verified. Please check back soon.",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to check status. Please try again.",
        variant: "destructive",
      });
    }
  }, [burnRequestId, toast]);

  const showConnectPrompt = appState === "selecting" && !connected && !isLoadingNFTs;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        walletAddress={walletAddress}
        isConnecting={false}
        onConnectWallet={handleConnectWallet}
        onDisconnectWallet={handleDisconnectWallet}
        onLogoClick={handleGoHome}
      />

      <main className="flex-1 flex flex-col">
        {appState === "home" && (
          <HeroSection onGetStarted={handleGetStarted} />
        )}

        {appState === "selecting" && (
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8 w-full">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-2">Your Eligible NFTs</h2>
              <p className="text-muted-foreground">
                Select up to {MAX_SELECTION} NFTs to burn. Each NFT earns you {DISCOUNT_PER_NFT}% off.
              </p>
            </div>

            {showConnectPrompt ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Wallet className="h-16 w-16 text-muted-foreground/50 mb-6" />
                <h3 className="text-xl font-medium mb-2">Connect Your Wallet</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Connect your Solana wallet to view your eligible NFTs for burning.
                </p>
                <Button onClick={handleConnectWallet} data-testid="button-connect-prompt">
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Wallet
                </Button>
              </div>
            ) : (
              <NFTGrid
                nfts={nfts}
                selectedNFTs={selectedNFTs}
                maxSelection={MAX_SELECTION}
                isLoading={isLoadingNFTs}
                onToggleNFT={handleToggleNFT}
              />
            )}
          </div>
        )}

        {appState === "form" && (
          <div className="mx-auto max-w-5xl px-4 md:px-8 lg:px-12 py-8">
            <UserInfoForm
              selectedNFTs={selectedNFTs}
              discountPercent={discountPercent}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
              onBack={handleBackToSelection}
            />
          </div>
        )}

        {appState === "confirmation" && (
          <div className="mx-auto max-w-lg px-4 md:px-8 lg:px-12 py-8">
            <ConfirmationScreen
              txSignature={txSignature}
              burnCount={selectedNFTs.length}
              discountPercent={discountPercent}
              codeStatus={codeStatus}
              onCheckStatus={handleCheckStatus}
            />
          </div>
        )}
      </main>

      {appState === "selecting" && connected && selectedNFTs.length > 0 && (
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

      <Footer onLogoClick={handleGoHome} />
    </div>
  );
}
