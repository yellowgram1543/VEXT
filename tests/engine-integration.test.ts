import { describe, it, expect, beforeEach } from 'vitest'
import { prisma } from '../src/lib/prisma'
import { 
  evaluatePractice,
  submitQuiz,
  evaluateApply,
  getTopicProgress
} from '../src/lib/learning-engine'
import { StageType } from '@prisma/client'

describe('Learning Engine Integration', () => {
  let testUser: any
  let testTopic: any

  beforeEach(async () => {
    // Clean up
    await prisma.submission.deleteMany()
    await prisma.userMastery.deleteMany()
    await prisma.quizAttempt.deleteMany()
    await prisma.progress.deleteMany()
    await prisma.topic.deleteMany()
    await prisma.module.deleteMany()
    await prisma.phase.deleteMany()
    await prisma.user.deleteMany()

    // Setup basic hierarchy
    testUser = await prisma.user.create({ data: { email: 'test@example.com' } })
    const phase = await prisma.phase.create({ data: { title: 'Phase 1', order: 1 } })
    const module = await prisma.module.create({ 
      data: { title: 'Module 1', order: 1, phaseId: phase.id } 
    })
    testTopic = await prisma.topic.create({ 
      data: { title: 'Topic 1', order: 1, slug: 'topic-1', moduleId: module.id } 
    })
  })

  it('should flow through PRACTICE -> TEST -> APPLY successfully', async () => {
    // 1. Initial State
    let progress = await getTopicProgress(testTopic.id)
    expect(progress.highestStage).toBe(StageType.UNDERSTAND)

    // Move to PRACTICE (manually)
    await prisma.progress.update({
      where: { chapterId: testTopic.id },
      data: { highestStage: StageType.PRACTICE }
    })

    // 2. Evaluate Practice (Math)
    const practiceResult = await evaluatePractice(
      testTopic.id,
      'math',
      'x + x',
      '2x',
      testUser.id
    )
    expect(practiceResult.success).toBe(true)

    // Verify progress moved to TEST
    progress = await getTopicProgress(testTopic.id)
    expect(progress.highestStage).toBe(StageType.TEST)

    // Verify submission record
    const submission = await prisma.submission.findFirst({
      where: { topicId: testTopic.id, stage: StageType.PRACTICE }
    })
    expect(submission).toBeDefined()
    expect(submission?.success).toBe(true)
    expect(submission?.content).toBe('x + x')

    // 3. Submit Quiz (TEST)
    const quizAttempt = await submitQuiz(testUser.id, testTopic.id, 0.9)
    expect(quizAttempt.passed).toBe(true)

    // Verify progress moved to APPLY
    progress = await getTopicProgress(testTopic.id)
    expect(progress.highestStage).toBe(StageType.APPLY)

    // 4. Evaluate Apply (Code)
    const applyResult = await evaluateApply(
      testTopic.id,
      'print("hello world")',
      testUser.id
    )
    expect(applyResult.success).toBe(true)

    // Verify topic marked as completed
    progress = await getTopicProgress(testTopic.id)
    expect(progress.completedAt).not.toBeNull()

    // Verify apply submission record
    const applySubmission = await prisma.submission.findFirst({
      where: { topicId: testTopic.id, stage: StageType.APPLY }
    })
    expect(applySubmission).toBeDefined()
    expect(applySubmission?.success).toBe(true)
  })

  it('should not advance PRACTICE if submission is incorrect', async () => {
    // Ensure progress is initialized
    await getTopicProgress(testTopic.id)

    // Start at PRACTICE
    await prisma.progress.update({
      where: { chapterId: testTopic.id },
      data: { highestStage: StageType.PRACTICE }
    })

    const practiceResult = await evaluatePractice(
      testTopic.id,
      'math',
      'x + y',
      '2x',
      testUser.id
    )
    expect(practiceResult.success).toBe(false)

    // Verify progress still at PRACTICE
    const progress = await getTopicProgress(testTopic.id)
    expect(progress.highestStage).toBe(StageType.PRACTICE)

    // Verify failed submission record
    const submission = await prisma.submission.findFirst({
      where: { topicId: testTopic.id, stage: StageType.PRACTICE }
    })
    expect(submission?.success).toBe(false)
  })
})
