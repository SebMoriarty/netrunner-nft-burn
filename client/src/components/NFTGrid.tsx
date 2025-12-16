import NFTCard, { type NFT } from "./NFTCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Inbox } from "lucide-react";

interface NFTGridProps {
  nfts: NFT[];
  selectedNFTs: NFT[];
  maxSelection: number;
  isLoading: boolean;
  onToggleNFT: (nft: NFT) => void;
}

export default function NFTGrid({
  nfts,
  selectedNFTs,
  maxSelection,
  isLoading,
  onToggleNFT,
}: NFTGridProps) {
  const selectedIds = new Set(selectedNFTs.map((n) => n.id));

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="text-center mb-6">
          <p className="text-muted-foreground">Fetching your NFTs from Helius...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Inbox className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Eligible NFTs Found</h3>
        <p className="text-muted-foreground max-w-sm">
          Your wallet doesn't contain any NFTs from the eligible collections.
          Only NFTs on our allowlist can be burned for discounts.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {nfts.map((nft) => (
        <NFTCard
          key={nft.id}
          nft={nft}
          isSelected={selectedIds.has(nft.id)}
          isDisabled={selectedNFTs.length >= maxSelection && !selectedIds.has(nft.id)}
          onToggle={onToggleNFT}
        />
      ))}
    </div>
  );
}
