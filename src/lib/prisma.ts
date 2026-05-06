// Prisma Client Singleton
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}


// In development, we sometimes need to force a new client to pick up schema changes
export const prisma = (process.env.NODE_ENV === 'development' && typeof window === 'undefined') 
  ? createPrismaClient() 
  : (globalForPrisma.prisma ?? createPrismaClient())

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
