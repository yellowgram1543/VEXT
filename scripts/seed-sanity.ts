import { createClient } from '@sanity/client'
import { uuid } from '@sanity/uuid'
import 'dotenv/config'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Required for writing
  apiVersion: '2024-04-18'
})

const n5Module = {
  _type: 'module',
  _id: 'module-n5-foundation',
  title: 'N5 Foundation',
  level: 'N5',
  order: 1,
  description: 'The absolute essentials of Japanese grammar and scripts following the Genki progression.'
}

const chapters = [
  {
    _type: 'chapter',
    _id: 'chapter-n5-01',
    title: 'Hiragana + Katakana',
    slug: { _type: 'slug', current: 'hiragana-katakana' },
    order: 1,
    module: { _type: 'reference', _ref: 'module-n5-foundation' },
    content: [
      {
        _type: 'block',
        _key: uuid(),
        children: [{ _type: 'span', text: '1. Intuition First: Japanese is written using three scripts. Think of Hiragana as the "round" everyday alphabet and Katakana as the "sharp" alphabet for foreign words.' }]
      },
      {
        _type: 'block',
        _key: uuid(),
        children: [{ _type: 'span', text: '2. Clear Rule: Hiragana is for native words. Katakana is for loanwords (e.g., Computer -> コンピュータ). Both have 46 basic sounds.' }]
      },
      { _type: 'exampleSentence', _key: uuid(), japanese: 'あいうえお', romaji: 'a i u e o', english: 'The first 5 vowels of Hiragana.' },
      { _type: 'exampleSentence', _key: uuid(), japanese: 'アイウエオ', romaji: 'a i u e o', english: 'The first 5 vowels of Katakana.' },
      { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '4. Pattern Insight: Every sound ends in a vowel, except for "n".' }] }
    ]
  },
  {
    _type: 'chapter',
    _id: 'chapter-n5-03',
    title: 'The Topic Particle は (wa)',
    slug: { _type: 'slug', current: 'particle-wa' },
    order: 3,
    module: { _type: 'reference', _ref: 'module-n5-foundation' },
    content: [
      {
        _type: 'block',
        _key: uuid(),
        children: [{ _type: 'span', text: '1. Intuition First: Imagine you are pointing at something and saying "As for this...". That is what は does.' }]
      },
      {
        _type: 'block',
        _key: uuid(),
        children: [{ _type: 'span', text: '2. Clear Rule: [Topic] + は + [Description]. Note that は is written as "ha" but pronounced "wa" when used as a particle.' }]
      },
      { _type: 'exampleSentence', _key: uuid(), japanese: '私は学生です。', romaji: 'Watashi wa gakusei desu.', english: 'As for me, I am a student.' },
      { _type: 'exampleSentence', _key: uuid(), japanese: '今日は暑いです。', romaji: 'Kyou wa atsui desu.', english: 'As for today, it is hot.' },
      { _type: 'exampleSentence', _key: uuid(), japanese: 'これはペンです。', romaji: 'Kore wa pen desu.', english: 'As for this, it is a pen.' },
      { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '4. Pattern Insight: The topic is often the subject, but not always. It just sets the context.' }] },
      { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '5. Mini Contrast: Unlike が, は emphasizes what comes AFTER the particle.' }] },
      { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '6. Micro Practice: [  ] は 日本人 です。 (Fill with "Tanaka-san")' }] }
    ]
  }
]

async function seed() {
  console.log('🚀 Seeding Sanity...')
  try {
    await client.createIfNotExists(n5Module)
    for (const chapter of chapters) {
      await client.createOrReplace(chapter)
      console.log(`✅ Seeded chapter: ${chapter.title}`)
    }
    console.log('🎉 Done!')
  } catch (err) {
    console.error('❌ Error:', err)
  }
}

seed()
