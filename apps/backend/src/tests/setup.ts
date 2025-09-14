import { beforeAll, afterAll } from '@jest/globals'
import { PrismaClient } from '@prisma/client'
import { createClient } from 'redis'
import dotenv from 'dotenv'
import path from 'path'

// Load test environment variables from root .env file
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') })

const prisma = new PrismaClient()
const redis = createClient()

beforeAll(async () => {
  try {
    // Connect to test database
    await prisma.$connect()
    await redis.connect()
    
    // Clean up test data
    await prisma.userActivity.deleteMany()
    await prisma.chatMessage.deleteMany()
    await prisma.chatSession.deleteMany()
    await prisma.documentComparison.deleteMany()
    await prisma.documentEmbedding.deleteMany()
    await prisma.document.deleteMany()
    await prisma.workspaceMember.deleteMany()
    await prisma.workspace.deleteMany()
    await prisma.user.deleteMany()
  } catch (error) {
    console.warn('Database connection failed in test setup:', error instanceof Error ? error.message : String(error))
    // Continue with tests even if database is not available
  }
})

afterAll(async () => {
  try {
    // Cleanup after tests
    await prisma.$disconnect()
    await redis.disconnect()
  } catch (error) {
    console.warn('Database cleanup failed:', error instanceof Error ? error.message : String(error))
  }
})