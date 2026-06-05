import "server-only";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

// Prisma 7 requires a driver adapter. We use the Neon adapter; the underlying
// pool is created lazily on first query, so an empty connection string here
// does not throw at import time (keeps `next build` green without a live DB).
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL ?? "",
});

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
