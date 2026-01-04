import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const burnRequests = pgTable("burn_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull(),
  email: text("email").notNull(),
  discord: text("discord").notNull(),
  nftMints: text("nft_mints").array().notNull(),
  nftCount: integer("nft_count").notNull(),
  discountPercent: integer("discount_percent").notNull(),
  txSignature: text("tx_signature"),
  status: text("status").notNull().default("pending"),
  discountCode: text("discount_code"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBurnRequestSchema = createInsertSchema(burnRequests).omit({
  id: true,
  createdAt: true,
});

export type InsertBurnRequest = z.infer<typeof insertBurnRequestSchema>;
export type BurnRequest = typeof burnRequests.$inferSelect;

export const submitBurnFormSchema = z.object({
  walletAddress: z.string().min(32, "Invalid wallet address"),
  email: z.string().email("Invalid email address"),
  discord: z.string().min(2, "Discord handle required"),
  nftMints: z.array(z.string()).min(1, "At least one NFT required").max(10, "Maximum 10 NFTs"),
  signature: z.string().min(1, "Wallet signature required"),
  message: z.string().min(1, "Signed message required"),
});

export type SubmitBurnForm = z.infer<typeof submitBurnFormSchema>;
