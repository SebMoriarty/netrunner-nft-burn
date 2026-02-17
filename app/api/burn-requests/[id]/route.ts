import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const burnRequest = await storage.getBurnRequest(id);

    if (!burnRequest) {
      return NextResponse.json({ error: "Burn request not found" }, { status: 404 });
    }

    return NextResponse.json(burnRequest);
  } catch (error) {
    console.error("Error fetching burn request:", error);
    return NextResponse.json({ error: "Failed to fetch burn request" }, { status: 500 });
  }
}
