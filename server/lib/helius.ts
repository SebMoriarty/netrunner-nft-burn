// Solana DAS API integration for fetching NFTs
// Supports both Helius and QuickNode RPC providers

// Eligible mint allowlist - only NFTs with these collection mints can be burned
const ELIGIBLE_MINTS = new Set([
  "DphFDYiifJ5NBCYXqsYVuDEynFTc2dASCRJeHQ4B4cNn",
]);

export interface HeliusNFT {
  id: string;
  mint: string;
  name: string;
  image: string;
}

interface DASAsset {
  id: string;
  content: {
    metadata: {
      name: string;
    };
    links?: {
      image?: string;
    };
    files?: Array<{ uri: string; mime?: string }>;
  };
  grouping?: Array<{ group_key: string; group_value: string }>;
}

// Get RPC URL from environment - supports QuickNode or Helius
function getRpcUrl(): string | null {
  // QuickNode RPC URL (includes API key in the URL from env)
  if (process.env.QUICKNODE_RPC_URL) {
    return process.env.QUICKNODE_RPC_URL;
  }
  // Helius RPC URL (includes API key in the URL from env)
  if (process.env.HELIUS_RPC_URL) {
    return process.env.HELIUS_RPC_URL;
  }
  return null;
}

export async function fetchWalletNFTs(walletAddress: string): Promise<HeliusNFT[]> {
  const rpcUrl = getRpcUrl();
  
  if (!rpcUrl) {
    console.warn('No RPC URL configured (QUICKNODE_RPC_URL or HELIUS_RPC_URL), returning empty array');
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
    
    // Filter to only eligible NFTs based on collection mint or individual mint
    const eligibleNFTs = assets.filter((asset) => {
      // Check if the NFT's collection is in the allowlist
      const collection = asset.grouping?.find(g => g.group_key === 'collection');
      if (collection && ELIGIBLE_MINTS.has(collection.group_value)) {
        return true;
      }
      // Check if the NFT's mint address itself is in the allowlist
      if (ELIGIBLE_MINTS.has(asset.id)) {
        return true;
      }
      return false;
    });

    return eligibleNFTs.map((asset) => ({
      id: asset.id,
      mint: asset.id,
      name: asset.content.metadata?.name || 'Unknown NFT',
      image: asset.content.links?.image || 
             asset.content.files?.[0]?.uri || 
             `https://placehold.co/400x400/1a1a2e/00d9ff?text=${encodeURIComponent(asset.content.metadata?.name || 'NFT')}`,
    }));
  } catch (error) {
    console.error('Failed to fetch NFTs:', error);
    return [];
  }
}

export function isEligibleMint(mint: string): boolean {
  return ELIGIBLE_MINTS.has(mint);
}

export function validateMints(mints: string[]): { valid: string[]; invalid: string[] } {
  const valid: string[] = [];
  const invalid: string[] = [];
  
  for (const mint of mints) {
    if (ELIGIBLE_MINTS.has(mint)) {
      valid.push(mint);
    } else {
      invalid.push(mint);
    }
  }
  
  return { valid, invalid };
}
