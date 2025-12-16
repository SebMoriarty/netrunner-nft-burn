import NFTCard from "../NFTCard";

export default function NFTCardExample() {
  const mockNFT = {
    id: "1",
    mint: "DphFDYiifJ5NBCYXqsYVuDEynFTc2dASCRJeHQ4B4cNn",
    name: "Netrunner #1337",
    image: "https://placehold.co/400x400/1a1a2e/00d9ff?text=NFT",
  };

  return (
    <div className="w-64">
      <NFTCard
        nft={mockNFT}
        isSelected={true}
        isDisabled={false}
        onToggle={(nft) => console.log("Toggled NFT:", nft.name)}
      />
    </div>
  );
}
