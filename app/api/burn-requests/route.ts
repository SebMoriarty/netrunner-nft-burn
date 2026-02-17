export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { submitBurnFormSchema } from "@shared/schema";
import { validateMints } from "@/lib/helius";
import nacl from "tweetnacl";
import bs58 from "bs58";

const DISCOUNT_PER_NFT = 3;
const MAX_NFTS = 10;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = submitBurnFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.message }, { status: 400 });
    }

    const { walletAddress, email, discord, nftMints, signature, message } = parsed.data;

    // Verify wallet signature to prove ownership
    try {
      const publicKeyBytes = bs58.decode(walletAddress);
      const signatureBytes = bs58.decode(signature);
      const messageBytes = new TextEncoder().encode(message);

      const isValid = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid wallet signature" }, { status: 401 });
      }

      // Verify the message contains expected content (prevent replay attacks)
      if (!message.includes("Netrunner NFT Burn") || !message.includes(walletAddress)) {
        return NextResponse.json({ error: "Invalid signature message format" }, { status: 401 });
      }
    } catch (sigError) {
      console.error("Signature verification error:", sigError);
      return NextResponse.json({ error: "Failed to verify wallet signature" }, { status: 401 });
    }

    // Validate mints against allowlist
    const { valid, invalid } = validateMints(nftMints);
    if (invalid.length > 0) {
      return NextResponse.json({
        error: "Some NFTs are not eligible for burning",
        invalidMints: invalid
      }, { status: 400 });
    }

    const nftCount = Math.min(valid.length, MAX_NFTS);
    const discountPercent = Math.min(nftCount * DISCOUNT_PER_NFT, 30);

    const burnRequest = await storage.createBurnRequest({
      walletAddress,
      email,
      discord,
      nftMints: valid,
      nftCount,
      discountPercent,
      status: "pending",
    });

    return NextResponse.json({
      id: burnRequest.id,
      nftCount: burnRequest.nftCount,
      discountPercent: burnRequest.discountPercent,
    });
  } catch (error) {
    console.error("Error creating burn request:", error);
    return NextResponse.json({ error: "Failed to create burn request" }, { status: 500 });
  }
}
