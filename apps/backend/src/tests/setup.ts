import { beforeAll, afterAll } from '@jest/globals'
import { PrismaClient } from '@prisma/client'
import { createClient } from 'redis'

const prisma = new PrismaClient()
const redis = createClient()

beforeAll(async () => {
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
})

afterAll(async () => {
  // Cleanup after tests
  await prisma.$disconnect()
  await redis.disconnect()
})