"use client";

import { useState } from "react";
import { Check, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NFT {
  id: string;
  mint: string;
  name: string;
  image: string;
}

interface NFTCardProps {
  nft: NFT;
  isSelected: boolean;
  isDisabled: boolean;
  onToggle: (nft: NFT) => void;
}

export default function NFTCard({
  nft,
  isSelected,
  isDisabled,
  onToggle,
}: NFTCardProps) {
  const [imgError, setImgError] = useState(false);

  const truncateMint = (mint: string) => {
    return `${mint.slice(0, 6)}...${mint.slice(-4)}`;
  };

  return (
    <button
      type="button"
      onClick={() => !isDisabled && onToggle(nft)}
      disabled={isDisabled && !isSelected}
      className={cn(
        "relative group rounded-lg overflow-visible border transition-all duration-200 text-left w-full",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isSelected
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-border bg-card hover-elevate active-elevate-2 hover:scale-[1.02]",
        isDisabled && !isSelected && "opacity-50 cursor-not-allowed"
      )}
      data-testid={`nft-card-${nft.id}`}
    >
      <div className="aspect-square relative overflow-hidden rounded-t-lg bg-muted">
        {imgError ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageOff className="h-8 w-8" />
            <span className="text-xs">Image unavailable</span>
          </div>
        ) : (
          <img
            src={nft.image}
            alt={nft.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}
        <div
          className={cn(
            "absolute top-2 right-2 h-6 w-6 rounded-full flex items-center justify-center transition-all",
            isSelected
              ? "bg-primary text-primary-foreground"
              : "bg-background/80 border border-border opacity-0 group-hover:opacity-100"
          )}
        >
          {isSelected && <Check className="h-3.5 w-3.5" />}
        </div>
      </div>
      <div className="p-2.5">
        <h3 className="font-medium text-sm truncate">{nft.name}</h3>
        <p className="text-xs font-mono text-muted-foreground mt-0.5">
          {truncateMint(nft.mint)}
        </p>
      </div>
    </button>
  );
}
