import { eq, desc, sql, count, countDistinct, isNotNull } from "drizzle-orm";
import { db } from "./db";
import { burnRequests, type InsertBurnRequest, type BurnRequest } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createBurnRequest(request: InsertBurnRequest): Promise<BurnRequest>;
  getBurnRequest(id: string): Promise<BurnRequest | undefined>;
  getBurnRequestByTxSignature(txSignature: string): Promise<BurnRequest | undefined>;
  getBurnRequestsByWallet(walletAddress: string): Promise<BurnRequest[]>;
  updateBurnRequestStatus(id: string, status: string, discountCode?: string): Promise<BurnRequest | undefined>;
  updateBurnRequestTxSignature(id: string, txSignature: string): Promise<BurnRequest | undefined>;
  getBurnStats(): Promise<{ totalBurns: number; discountsClaimed: number; activeBurners: number }>;
}

export class DatabaseStorage implements IStorage {
  async createBurnRequest(request: InsertBurnRequest): Promise<BurnRequest> {
    const [burnRequest] = await db.insert(burnRequests).values(request).returning();
    return burnRequest;
  }

  async getBurnRequest(id: string): Promise<BurnRequest | undefined> {
    const [burnRequest] = await db.select().from(burnRequests).where(eq(burnRequests.id, id));
    return burnRequest;
  }

  async getBurnRequestByTxSignature(txSignature: string): Promise<BurnRequest | undefined> {
    const [burnRequest] = await db.select().from(burnRequests).where(eq(burnRequests.txSignature, txSignature));
    return burnRequest;
  }

  async getBurnRequestsByWallet(walletAddress: string): Promise<BurnRequest[]> {
    return db.select().from(burnRequests)
      .where(eq(burnRequests.walletAddress, walletAddress))
      .orderBy(desc(burnRequests.createdAt));
  }

  async updateBurnRequestStatus(id: string, status: string, discountCode?: string): Promise<BurnRequest | undefined> {
    const updateData: Partial<BurnRequest> = { status };
    if (discountCode) {
      updateData.discountCode = discountCode;
    }
    const [updated] = await db.update(burnRequests)
      .set(updateData)
      .where(eq(burnRequests.id, id))
      .returning();
    return updated;
  }

  async updateBurnRequestTxSignature(id: string, txSignature: string): Promise<BurnRequest | undefined> {
    const [updated] = await db.update(burnRequests)
      .set({ txSignature })
      .where(eq(burnRequests.id, id))
      .returning();
    return updated;
  }

  async getBurnStats(): Promise<{ totalBurns: number; discountsClaimed: number; activeBurners: number }> {
    const [totalResult] = await db.select({ 
      count: sql<number>`COALESCE(SUM(nft_count), 0)::int` 
    }).from(burnRequests).where(isNotNull(burnRequests.txSignature));
    
    const [claimedResult] = await db.select({ 
      count: count() 
    }).from(burnRequests).where(isNotNull(burnRequests.discountCode));
    
    const [burnersResult] = await db.select({ 
      count: countDistinct(burnRequests.walletAddress) 
    }).from(burnRequests).where(isNotNull(burnRequests.txSignature));

    return {
      totalBurns: totalResult?.count || 0,
      discountsClaimed: claimedResult?.count || 0,
      activeBurners: burnersResult?.count || 0,
    };
  }
}

export const storage = new DatabaseStorage();
