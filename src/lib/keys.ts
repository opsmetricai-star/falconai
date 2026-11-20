import { createHash, randomBytes, timingSafeEqual } from "crypto";

export const hashKey = (k: string) => createHash("sha256").update(k).digest("hex");
export const newKey = () => `fai_${randomBytes(24).toString("hex")}`;

export function safeEqual(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
