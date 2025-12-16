import UserInfoForm from "../UserInfoForm";
import type { NFT } from "../NFTCard";

export default function UserInfoFormExample() {
  // todo: remove mock functionality
  const mockNFTs: NFT[] = Array.from({ length: 4 }, (_, i) => ({
    id: String(i + 1),
    mint: `DphFDYiifJ5NBCYXqsYVuDEynFTc2dASCRJeHQ4B4cNn${i}`,
    name: `Netrunner #${1337 + i}`,
    image: `https://placehold.co/400x400/1a1a2e/00d9ff?text=NFT${i + 1}`,
  }));

  return (
    <UserInfoForm
      selectedNFTs={mockNFTs}
      discountPercent={12}
      isSubmitting={false}
      onSubmit={(data) => console.log("Form submitted:", data)}
      onBack={() => console.log("Back clicked")}
    />
  );
}
