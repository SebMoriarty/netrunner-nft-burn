import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET(
  _req: NextRequest,
  { params }: { params: { walletAddress: string } }
) {
  try {
    const { walletAddress } = params;
    const burnRequests = await storage.getBurnRequestsByWallet(walletAddress);
    return NextResponse.json(burnRequests);
  } catch (error) {
    console.error("Error fetching burn history:", error);
    return NextResponse.json({ error: "Failed to fetch burn history" }, { status: 500 });
  }
}
