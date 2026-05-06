import { describe, it, expect, beforeEach } from 'vitest'
import { prisma } from '../src/lib/prisma'
import { 
  isStageUnlocked, 
  getNextStage, 
  getTopicProgress, 
  unlockNextStage,
  submitQuiz 
} from '../src/lib/learning-engine'
import { StageType } from '@prisma/client'

describe('Learning Engine Logic', () => {
  let testUser: any
  let testPhase: any
  let testModule: any
  let testTopic: any

  beforeEach(async () => {
    // Clean up
    await prisma.userMastery.deleteMany()
    await prisma.quizAttempt.deleteMany()
    await prisma.progress.deleteMany()
    await prisma.topic.deleteMany()
    await prisma.module.deleteMany()
    await prisma.phase.deleteMany()
    await prisma.user.deleteMany()

    // Setup basic hierarchy
    testUser = await prisma.user.create({ data: { email: 'test@example.com' } })
    testPhase = await prisma.phase.create({ data: { title: 'Phase 1', order: 1 } })
    testModule = await prisma.module.create({ 
      data: { title: 'Module 1', order: 1, phaseId: testPhase.id } 
    })
    testTopic = await prisma.topic.create({ 
      data: { title: 'Topic 1', order: 1, slug: 'topic-1', moduleId: testModule.id } 
    })
  })

  describe('Pure Logic', () => {
    it('isStageUnlocked should return true for completed stages', () => {
      expect(isStageUnlocked(StageType.TEST, StageType.UNDERSTAND)).toBe(true)
      expect(isStageUnlocked(StageType.TEST, StageType.REINFORCE)).toBe(true)
      expect(isStageUnlocked(StageType.TEST, StageType.TEST)).toBe(true)
      expect(isStageUnlocked(StageType.TEST, StageType.APPLY)).toBe(false)
    })

    it('getNextStage should handle sequential unlocking', () => {
      expect(getNextStage(StageType.UNDERSTAND)).toBe(StageType.REINFORCE)
      expect(getNextStage(StageType.REINFORCE)).toBe(StageType.PRACTICE)
      expect(getNextStage(StageType.PRACTICE)).toBe(StageType.TEST)
    })

    it('getNextStage should only unlock APPLY if quiz score >= 0.8', () => {
      expect(getNextStage(StageType.TEST, 0.7)).toBe(StageType.TEST)
      expect(getNextStage(StageType.TEST, 0.8)).toBe(StageType.APPLY)
    })
  })

  describe('Database Transitions', () => {
    it('getTopicProgress should initialize progress if it doesnt exist', async () => {
      const progress = await getTopicProgress(testTopic.id)
      expect(progress.highestStage).toBe(StageType.UNDERSTAND)
      expect(progress.chapterId).toBe(testTopic.id)
    })

    it('unlockNextStage should advance UNDERSTAND -> REINFORCE', async () => {
      await unlockNextStage(testTopic.id, StageType.UNDERSTAND)
      const progress = await getTopicProgress(testTopic.id)
      expect(progress.highestStage).toBe(StageType.REINFORCE)
    })

    it('submitQuiz should unlock APPLY on success', async () => {
      await submitQuiz(testUser.id, testTopic.id, 0.9)
      const progress = await getTopicProgress(testTopic.id)
      expect(progress.highestStage).toBe(StageType.APPLY)
      
      const attempt = await prisma.quizAttempt.findFirst({ where: { topicId: testTopic.id } })
      expect(attempt?.passed).toBe(true)
    })

    it('submitQuiz should NOT unlock APPLY on failure', async () => {
      await submitQuiz(testUser.id, testTopic.id, 0.5)
      const progress = await getTopicProgress(testTopic.id)
      expect(progress.highestStage).toBe(StageType.UNDERSTAND)
    })
  })
})
