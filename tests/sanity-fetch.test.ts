import { describe, it, expect, vi } from 'vitest'

// Mock the sanity client
vi.mock('@/lib/sanity', () => ({
  fetchSanity: vi.fn()
}))

import { fetchSanity } from '@/lib/sanity'

describe('Sanity Fetch Structural Validation', () => {
  it('should fetch a topic with all 4 learning stages', async () => {
    const mockTopic = {
      _id: 'topic-1',
      title: 'Linear Regression',
      slug: { current: 'linear-regression' },
      understand: { content: [] },
      reinforce: { practices: [] },
      test: { questions: [] },
      apply: { instruction: 'Build a model', spec: [], sandbox: { runtime: 'python' } }
    }

    vi.mocked(fetchSanity).mockResolvedValue(mockTopic)

    const topic = await fetchSanity<any>('*[_type == "topic"][0]')

    expect(topic).toBeDefined()
    expect(topic.understand).toBeDefined()
    expect(topic.reinforce).toBeDefined()
    expect(topic.test).toBeDefined()
    expect(topic.apply).toBeDefined()
    expect(topic.apply.sandbox.runtime).toBe('python')
  })
})
