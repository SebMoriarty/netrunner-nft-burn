import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { submitBurnFormSchema } from "@shared/schema";
import { generateDiscountCode } from "./utils";

const DISCOUNT_PER_NFT = 3;
const MAX_NFTS = 10;
const ELIGIBLE_MINTS = ["DphFDYiifJ5NBCYXqsYVuDEynFTc2dASCRJeHQ4B4cNn"];

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/burn-requests", async (req, res) => {
    try {
      const parsed = submitBurnFormSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }

      const { walletAddress, email, discord, nftMints } = parsed.data;

      const invalidMints = nftMints.filter(mint => !ELIGIBLE_MINTS.includes(mint));
      if (invalidMints.length > 0) {
        return res.status(400).json({ error: "Some NFTs are not eligible for burning" });
      }

      const nftCount = Math.min(nftMints.length, MAX_NFTS);
      const discountPercent = Math.min(nftCount * DISCOUNT_PER_NFT, 30);

      const burnRequest = await storage.createBurnRequest({
        walletAddress,
        email,
        discord,
        nftMints,
        nftCount,
        discountPercent,
        status: "pending",
      });

      res.json({ 
        id: burnRequest.id,
        nftCount: burnRequest.nftCount,
        discountPercent: burnRequest.discountPercent,
      });
    } catch (error) {
      console.error("Error creating burn request:", error);
      res.status(500).json({ error: "Failed to create burn request" });
    }
  });

  app.patch("/api/burn-requests/:id/transaction", async (req, res) => {
    try {
      const { id } = req.params;
      const { txSignature } = req.body;

      if (!txSignature) {
        return res.status(400).json({ error: "Transaction signature required" });
      }

      const updated = await storage.updateBurnRequestTxSignature(id, txSignature);
      if (!updated) {
        return res.status(404).json({ error: "Burn request not found" });
      }

      res.json({ success: true, txSignature });
    } catch (error) {
      console.error("Error updating transaction:", error);
      res.status(500).json({ error: "Failed to update transaction" });
    }
  });

  app.get("/api/burn-requests/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const burnRequest = await storage.getBurnRequest(id);
      
      if (!burnRequest) {
        return res.status(404).json({ error: "Burn request not found" });
      }

      res.json(burnRequest);
    } catch (error) {
      console.error("Error fetching burn request:", error);
      res.status(500).json({ error: "Failed to fetch burn request" });
    }
  });

  app.get("/api/burn-history/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const burnRequests = await storage.getBurnRequestsByWallet(walletAddress);
      
      res.json(burnRequests);
    } catch (error) {
      console.error("Error fetching burn history:", error);
      res.status(500).json({ error: "Failed to fetch burn history" });
    }
  });

  app.post("/api/webhook/helius", async (req, res) => {
    try {
      const webhookSecret = process.env.HELIUS_WEBHOOK_SECRET;
      
      const signature = req.body?.signature || req.body?.[0]?.signature;
      if (!signature) {
        return res.status(400).json({ error: "No signature in webhook" });
      }

      const burnRequest = await storage.getBurnRequestByTxSignature(signature);
      if (!burnRequest) {
        console.log("No burn request found for signature:", signature);
        return res.status(200).json({ message: "No matching burn request" });
      }

      const discountCode = generateDiscountCode(burnRequest.discountPercent);
      
      await storage.updateBurnRequestStatus(burnRequest.id, "verified", discountCode);

      console.log(`Burn verified for ${burnRequest.walletAddress}, code: ${discountCode}`);

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  });

  return httpServer;
}
