import { PrismaClient } from '@prisma/client';

/**
 * @type PrismaClient
 */
let prisma: PrismaClient = new PrismaClient();

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
  prisma.$connect();
} else {
  // @ts-ignore
  if (!global.__db) {
    // @ts-ignore
    global.__db = new PrismaClient();
    // @ts-ignore
    global.__db.$connect();
  }
  // @ts-ignore
  prisma = global.__db;
}

export { prisma };
