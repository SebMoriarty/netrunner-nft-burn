import { NextRequest, NextResponse } from "next/server";
import { fetchWalletNFTs } from "@/lib/helius";

export async function GET(
  _req: NextRequest,
  { params }: { params: { walletAddress: string } }
) {
  try {
    const { walletAddress } = params;

    if (!walletAddress || walletAddress.length < 32) {
      return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 });
    }

    const nfts = await fetchWalletNFTs(walletAddress);
    return NextResponse.json(nfts);
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return NextResponse.json({ error: "Failed to fetch NFTs" }, { status: 500 });
  }
}
