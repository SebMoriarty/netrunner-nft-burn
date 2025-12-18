import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { submitBurnFormSchema } from "@shared/schema";
import { generateDiscountCode } from "./utils";
import { fetchWalletNFTs, validateMints } from "./lib/helius";
import { appendBurnRecord, updateBurnRecord, initializeSheet, type BurnRecord } from "./lib/googleSheets";

const DISCOUNT_PER_NFT = 3;
const MAX_NFTS = 10;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Initialize Google Sheet headers on startup
  initializeSheet().catch(console.error);

  // Fetch eligible NFTs for a wallet using Helius DAS API
  app.get("/api/nfts/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      
      if (!walletAddress || walletAddress.length < 32) {
        return res.status(400).json({ error: "Invalid wallet address" });
      }

      const nfts = await fetchWalletNFTs(walletAddress);
      res.json(nfts);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      res.status(500).json({ error: "Failed to fetch NFTs" });
    }
  });

  app.post("/api/burn-requests", async (req, res) => {
    try {
      const parsed = submitBurnFormSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }

      const { walletAddress, email, discord, nftMints } = parsed.data;

      // Validate mints against allowlist
      const { valid, invalid } = validateMints(nftMints);
      if (invalid.length > 0) {
        return res.status(400).json({ 
          error: "Some NFTs are not eligible for burning",
          invalidMints: invalid 
        });
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

      // Record to Google Sheets
      const sheetRecord: BurnRecord = {
        id: burnRequest.id,
        walletAddress: burnRequest.walletAddress,
        email: burnRequest.email,
        discord: burnRequest.discord,
        nftMints: burnRequest.nftMints,
        nftCount: burnRequest.nftCount,
        discountPercent: burnRequest.discountPercent,
        discountCode: null,
        txSignature: null,
        status: burnRequest.status,
        createdAt: burnRequest.createdAt,
      };
      appendBurnRecord(sheetRecord).catch(console.error);

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

      // Update Google Sheet
      updateBurnRecord(id, { txSignature }).catch(console.error);

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

      // Update Google Sheet with verified status and discount code
      updateBurnRecord(burnRequest.id, { 
        status: "verified", 
        discountCode 
      }).catch(console.error);

      // TODO: Send email with discount code using Resend or Mailchimp

      console.log(`Burn verified for ${burnRequest.walletAddress}, code: ${discountCode}`);

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  });

  return httpServer;
}
