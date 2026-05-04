import { describe, it, expect } from 'vitest'
import phase from '../src/sanity/schemaTypes/phase'
import moduleSchema from '../src/sanity/schemaTypes/module'
import topic from '../src/sanity/schemaTypes/topic'

describe('Sanity Schema Hierarchy', () => {
  it('should have a valid phase schema', () => {
    expect(phase.name).toBe('phase')
    expect(phase.type).toBe('document')
    const fields = (phase as any).fields
    expect(fields.find((f: any) => f.name === 'title')).toBeDefined()
    expect(fields.find((f: any) => f.name === 'slug')).toBeDefined()
  })

  it('should have a module schema referencing phase', () => {
    expect(moduleSchema.name).toBe('module')
    const fields = (moduleSchema as any).fields
    const phaseField = fields.find((f: any) => f.name === 'phase')
    expect(phaseField).toBeDefined()
    expect(phaseField.type).toBe('reference')
    expect(phaseField.to[0].type).toBe('phase')
  })

  it('should have a topic schema referencing module and stages', () => {
    expect(topic.name).toBe('topic')
    const fields = (topic as any).fields
    const moduleField = fields.find((f: any) => f.name === 'module')
    expect(moduleField).toBeDefined()
    expect(moduleField.type).toBe('reference')
    expect(moduleField.to[0].type).toBe('module')

    const understandField = fields.find((f: any) => f.name === 'understand')
    expect(understandField).toBeDefined()
    expect(understandField.type).toBe('understand')

    const reinforceField = fields.find((f: any) => f.name === 'reinforce')
    expect(reinforceField).toBeDefined()
    expect(reinforceField.type).toBe('reinforce')

    const testField = fields.find((f: any) => f.name === 'test')
    expect(testField).toBeDefined()
    expect(testField.type).toBe('test')
  })

  it('should have a valid test schema with quiz questions', async () => {
    const { default: testSchema, quizQuestion } = await import('../src/sanity/schemaTypes/objects/test')
    expect(testSchema.name).toBe('test')
    expect(quizQuestion.name).toBe('quizQuestion')
    
    const questionFields = (quizQuestion as any).fields
    expect(questionFields.find((f: any) => f.name === 'type').options.list).toContainEqual({ title: 'Scenario', value: 'scenario' })
    expect(questionFields.find((f: any) => f.name === 'type').options.list).toContainEqual({ title: 'Visual', value: 'visual' })
    expect(questionFields.find((f: any) => f.name === 'image').hidden).toBeDefined()
  })
})
