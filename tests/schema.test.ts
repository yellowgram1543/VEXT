import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { prisma } from '../src/lib/prisma'

describe('ML Cognitive Coach Schema Integrity', () => {
  beforeAll(async () => {
    // Clean up before tests
    await prisma.userMastery.deleteMany()
    await prisma.quizAttempt.deleteMany()
    await prisma.topicProgress.deleteMany()
    await prisma.topic.deleteMany()
    await prisma.module.deleteMany()
    await prisma.phase.deleteMany()
    await prisma.user.deleteMany()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should maintain Phase -> Module -> Topic hierarchy', async () => {
    const phase = await prisma.phase.create({
      data: {
        order: 1,
        title: 'Phase 1: Foundations',
        modules: {
          create: {
            order: 1,
            title: 'Module 1: Introduction',
            topics: {
              create: {
                order: 1,
                title: 'Topic 1: ML Basics',
                slug: 'ml-basics',
              }
            }
          }
        }
      },
      include: {
        modules: {
          include: {
            topics: true
          }
        }
      }
    })

    expect(phase.title).toBe('Phase 1: Foundations')
    expect(phase.modules).toHaveLength(1)
    expect(phase.modules[0].title).toBe('Module 1: Introduction')
    expect(phase.modules[0].topics).toHaveLength(1)
    expect(phase.modules[0].topics[0].title).toBe('Topic 1: ML Basics')
  })

  it('should enforce unique [userId, topicId] constraint in TopicProgress', async () => {
    const user = await prisma.user.create({
      data: { email: 'test@example.com' }
    })

    const topic = await prisma.topic.findFirst()
    if (!topic) throw new Error('Topic not found')

    // Create first progress
    await prisma.topicProgress.create({
      data: {
        userId: user.id,
        topicId: topic.id,
        highestStage: 'UNDERSTAND'
      }
    })

    // Attempt to create duplicate progress (should fail)
    await expect(prisma.topicProgress.create({
      data: {
        userId: user.id,
        topicId: topic.id,
        highestStage: 'REINFORCE'
      }
    })).rejects.toThrow()
  })

  it('should allow creation of QuizAttempt and UserMastery', async () => {
    const user = await prisma.user.findFirst({ where: { email: 'test@example.com' } })
    const topic = await prisma.topic.findFirst()
    if (!user || !topic) throw new Error('User or Topic not found')

    const quizAttempt = await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        topicId: topic.id,
        score: 0.85,
        passed: true
      }
    })

    expect(quizAttempt.score).toBe(0.85)
    expect(quizAttempt.passed).toBe(true)

    const mastery = await prisma.userMastery.create({
      data: {
        userId: user.id,
        mathScore: 0.9,
        codingScore: 0.8,
        conceptsScore: 0.85
      }
    })

    expect(mastery.mathScore).toBe(0.9)
    expect(mastery.userId).toBe(user.id)
  })
})
