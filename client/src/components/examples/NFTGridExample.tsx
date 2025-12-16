import NFTGrid from "../NFTGrid";
import type { NFT } from "../NFTCard";

export default function NFTGridExample() {
  // todo: remove mock functionality
  const mockNFTs: NFT[] = Array.from({ length: 6 }, (_, i) => ({
    id: String(i + 1),
    mint: `DphFDYiifJ5NBCYXqsYVuDEynFTc2dASCRJeHQ4B4cNn${i}`,
    name: `Netrunner #${1337 + i}`,
    image: `https://placehold.co/400x400/1a1a2e/00d9ff?text=NFT${i + 1}`,
  }));

  const selectedNFTs = mockNFTs.slice(0, 3);

  return (
    <NFTGrid
      nfts={mockNFTs}
      selectedNFTs={selectedNFTs}
      maxSelection={10}
      isLoading={false}
      onToggleNFT={(nft) => console.log("Toggled:", nft.name)}
    />
  );
}
