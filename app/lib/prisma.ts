import { PrismaClient } from "@prisma/client";

// ვამოწმებთ, რომ PrismaClient უკვე არსებობს
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"], // დამატებითი ლოგირება
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
