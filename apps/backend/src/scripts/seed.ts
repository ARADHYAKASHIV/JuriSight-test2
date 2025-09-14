import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { UserRole, DocumentCategory } from '@shared'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@jurisight.com' },
    update: {},
    create: {
      email: 'admin@jurisight.com',
      password: adminPassword,
      role: UserRole.ADMIN,
      preferences: {
        theme: 'system',
        notifications: true,
        language: 'en',
      },
    },
  })

  // Create demo user
  const demoPassword = await bcrypt.hash('demo123', 12)
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@jurisight.com' },
    update: {},
    create: {
      email: 'demo@jurisight.com',
      password: demoPassword,
      role: UserRole.ANALYST,
      preferences: {
        theme: 'light',
        notifications: true,
        language: 'en',
      },
    },
  })

  // Create default workspace
  const workspace = await prisma.workspace.upsert({
    where: { id: 'default-workspace' },
    update: {},
    create: {
      id: 'default-workspace',
      name: 'Legal Department',
      ownerId: admin.id,
      settings: {
        allowDocumentSharing: true,
        requireApprovalForUploads: false,
        maxFileSize: 52428800, // 50MB
        allowedFileTypes: ['pdf', 'doc', 'docx', 'txt'],
      },
    },
  })

  // Add demo user to workspace
  await prisma.workspaceMember.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId: demoUser.id,
      },
    },
    update: {},
    create: {
      workspaceId: workspace.id,
      userId: demoUser.id,
      role: 'MEMBER',
      permissions: {
        canUpload: true,
        canAnalyze: true,
        canCompare: true,
        canChat: true,
      },
    },
  })

  // Create sample document templates
  const contractTemplate = await prisma.documentTemplate.create({
    data: {
      workspaceId: workspace.id,
      name: 'Service Agreement Template',
      description: 'Standard template for service agreements',
      data: {
        sections: [
          'Parties',
          'Scope of Services',
          'Payment Terms',
          'Intellectual Property',
          'Confidentiality',
          'Termination',
          'Governing Law',
        ],
        requiredFields: [
          'client_name',
          'service_provider_name',
          'effective_date',
          'payment_amount',
          'payment_schedule',
        ],
        standardClauses: {
          confidentiality: 'Standard confidentiality clause...',
          termination: 'Either party may terminate this agreement...',
          governingLaw: 'This agreement shall be governed by...',
        },
      },
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log(`👤 Admin user: admin@jurisight.com (password: admin123)`)
  console.log(`👤 Demo user: demo@jurisight.com (password: demo123)`)
  console.log(`🏢 Default workspace: ${workspace.name}`)
  console.log(`📄 Contract template created: ${contractTemplate.name}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })