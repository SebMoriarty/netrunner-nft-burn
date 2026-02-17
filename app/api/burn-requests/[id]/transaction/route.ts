export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { txSignature } = body;

    if (!txSignature) {
      return NextResponse.json({ error: "Transaction signature required" }, { status: 400 });
    }

    const updated = await storage.updateBurnRequestTxSignature(id, txSignature);
    if (!updated) {
      return NextResponse.json({ error: "Burn request not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, txSignature });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 });
  }
}
