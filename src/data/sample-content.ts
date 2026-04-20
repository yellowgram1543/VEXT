import { Module, Chapter } from '../types'

export const sampleN5Module: Module = {
  _id: 'm1',
  title: 'JLPT N5: Basic Particles',
  description: 'Learn the foundational particles of the Japanese language.',
  level: 'N5',
  order: 1,
}

export const sampleChapters: Chapter[] = [
  {
    _id: 'c1',
    title: 'The Topic Particle "wa" (は)',
    slug: { current: 'topic-particle-wa' },
    module: { _ref: 'm1' },
    order: 1,
    content: [
      {
        _type: 'block',
        children: [{ _type: 'span', text: 'The particle は (pronounced "wa") is used to mark the topic of a sentence.' }],
      },
      {
        _type: 'exampleSentence',
        japanese: '私は学生です。',
        romaji: 'Watashi wa gakusei desu.',
        english: 'I am a student.',
      }
    ],
  },
  {
    _id: 'c2',
    title: 'The Subject Particle "ga" (が)',
    slug: { current: 'subject-particle-ga' },
    module: { _ref: 'm1' },
    order: 2,
    content: [
      {
        _type: 'block',
        children: [{ _type: 'span', text: 'The particle が marks the grammatical subject of the sentence.' }],
      },
      {
        _type: 'exampleSentence',
        japanese: '猫が好きです。',
        romaji: 'Neko ga suki desu.',
        english: 'I like cats.',
      }
    ],
  }
]
