import { randomBytes } from "crypto";

export function generateDiscountCode(discountPercent: number): string {
  const randomPart = randomBytes(4).toString("hex").toUpperCase();
  return `BURN${discountPercent}-${randomPart}`;
}
