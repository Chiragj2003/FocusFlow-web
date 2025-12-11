import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const DATABASE_URL = "postgresql://neondb_owner:npg_hlxMfV69Nqpu@ep-rapid-butterfly-a1nlyakz-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  // Use PrismaNeon adapter with direct connection string
  const adapter = new PrismaNeon({ connectionString: DATABASE_URL })
  
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }
export default prisma
