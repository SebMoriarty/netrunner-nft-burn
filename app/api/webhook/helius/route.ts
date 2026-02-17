import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { generateDiscountCode } from "@/lib/discount";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const signature = body?.signature || body?.[0]?.signature;
    if (!signature) {
      return NextResponse.json({ error: "No signature in webhook" }, { status: 400 });
    }

    const burnRequest = await storage.getBurnRequestByTxSignature(signature);
    if (!burnRequest) {
      console.log("No burn request found for signature:", signature);
      return NextResponse.json({ message: "No matching burn request" }, { status: 200 });
    }

    const discountCode = generateDiscountCode(burnRequest.discountPercent);

    await storage.updateBurnRequestStatus(burnRequest.id, "verified", discountCode);

    // TODO: Send email with discount code using Resend or Mailchimp

    console.log(`Burn verified for ${burnRequest.walletAddress}, code: ${discountCode}`);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
