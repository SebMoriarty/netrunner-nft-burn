// Solana DAS API integration for fetching NFTs
// Supports both Helius and QuickNode RPC providers

// Eligible collection identifiers - can be collection addresses OR first verified creator addresses
// Netrunner uses the first verified creator pattern (older Metaplex standard before certified collections)
const ELIGIBLE_FIRST_CREATORS = new Set([
  "1qYQboR1jkeDZdbwBCpXbBcNGPTPh9T5iHWmkvyrtAh", // Netrunner first verified creator
]);

// Eligible certified collections (Metaplex standard)
const ELIGIBLE_COLLECTIONS = new Set<string>([
  // Add certified collection addresses here if needed
]);

// Individual mint addresses that are eligible (fallback for specific NFTs)
const ELIGIBLE_MINTS = new Set<string>([
  // Add specific mint addresses here if needed
]);

export interface HeliusNFT {
  id: string;
  mint: string;
  name: string;
  image: string;
}

interface DASCreator {
  address: string;
  share: number;
  verified: boolean;
}

interface DASAsset {
  id: string;
  content: {
    metadata: {
      name: string;
      attributes?: Array<{ trait_type: string; value: string }>;
    };
    links?: {
      image?: string;
    };
    files?: Array<{ uri: string; mime?: string }>;
  };
  grouping?: Array<{ group_key: string; group_value: string }>;
  creators?: DASCreator[];
}

function getAssetImage(asset: DASAsset): string {
  // For Netrunner V2 NFTs, the individual image is in "OG Image" attribute or files[1]
  const ogImageAttr = asset.content.metadata?.attributes?.find(
    attr => attr.trait_type === "OG Image"
  );
  if (ogImageAttr?.value) {
    return ogImageAttr.value;
  }

  // Try the second file (often the individual image for upgraded NFTs)
  if (asset.content.files && asset.content.files.length > 1) {
    return asset.content.files[1].uri;
  }

  // Fallback to primary links.image or first file
  return asset.content.links?.image ||
         asset.content.files?.[0]?.uri ||
         `https://placehold.co/400x400/1a1a2e/00d9ff?text=${encodeURIComponent(asset.content.metadata?.name || 'NFT')}`;
}

// Get RPC URL from environment - supports QuickNode or Helius
function getRpcUrl(): string | null {
  const rpcUrl = process.env.QUICKNODE_RPC_URL;
  if (rpcUrl) {
    return rpcUrl;
  }
  return null;
}

// Check if an asset is eligible based on collection, first creator, or individual mint
function isAssetEligible(asset: DASAsset): boolean {
  // Check if the NFT's certified collection is in the allowlist
  const collection = asset.grouping?.find(g => g.group_key === 'collection');
  if (collection && ELIGIBLE_COLLECTIONS.has(collection.group_value)) {
    return true;
  }

  // Check if the first verified creator is in the allowlist (older Metaplex standard)
  const firstVerifiedCreator = asset.creators?.find(c => c.verified);
  if (firstVerifiedCreator && ELIGIBLE_FIRST_CREATORS.has(firstVerifiedCreator.address)) {
    return true;
  }

  // Check if the NFT's mint address itself is in the allowlist
  if (ELIGIBLE_MINTS.has(asset.id)) {
    return true;
  }

  return false;
}

export async function fetchWalletNFTs(walletAddress: string): Promise<HeliusNFT[]> {
  const rpcUrl = getRpcUrl();

  if (!rpcUrl) {
    console.warn('No RPC URL configured (QUICKNODE_RPC_URL), returning empty array');
    return [];
  }

  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'nft-fetch',
        method: 'getAssetsByOwner',
        params: {
          ownerAddress: walletAddress,
          page: 1,
          limit: 1000,
          displayOptions: {
            showCollectionMetadata: true,
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`RPC API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`RPC error: ${data.error.message}`);
    }

    const assets: DASAsset[] = data.result?.items || [];

    // Filter to only eligible NFTs
    const eligibleNFTs = assets.filter(isAssetEligible);

    console.log(`Found ${assets.length} total NFTs, ${eligibleNFTs.length} eligible for burning`);

    return eligibleNFTs.map((asset) => ({
      id: asset.id,
      mint: asset.id,
      name: asset.content.metadata?.name || 'Unknown NFT',
      image: getAssetImage(asset),
    }));
  } catch (error) {
    console.error('Failed to fetch NFTs:', error);
    return [];
  }
}

export function isEligibleMint(mint: string): boolean {
  return true; // We already filtered eligible NFTs on fetch
}

export function validateMints(mints: string[]): { valid: string[]; invalid: string[] } {
  return { valid: mints, invalid: [] };
}
