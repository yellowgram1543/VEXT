import { createClient } from '@sanity/client'
import { uuid } from '@sanity/uuid'
import 'dotenv/config'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-04-18'
})

const chapterGa = {
  _type: 'chapter',
  _id: 'chapter-n5-04',
  title: 'The Subject Particle が (ga)',
  slug: { _type: 'slug', current: 'particle-ga' },
  order: 4,
  module: { _type: 'reference', _ref: 'module-n5-foundation' },
  content: [
    // 1. Introduction
    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '1. Introduction' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'The particle が (ga) is the subject marker. While は (wa) sets the topic (what we are talking about), が identifies the specific actor or the thing doing the action.' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'Key Concept: が marks the "doer" of the sentence. It is used when the subject is new information or needs to be specifically identified.', marks: ['strong'] }] },

    // 2. Basic Structure
    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '2. Basic Structure' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '[Subject] + が + [Verb/Adjective/State]' }] },
    { _type: 'exampleSentence', _key: uuid(), japanese: '雨が降っています。', romaji: 'Ame ga futte imasu.', english: 'It is raining. (Rain is falling)' },

    // 3. Core Uses
    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '3. Core Uses with Detailed Examples' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '3.1 Identifying New Information' }] },
    { _type: 'exampleSentence', _key: uuid(), japanese: '誰が来ましたか？', romaji: 'Dare ga kimashita ka?', english: 'Who came?' },
    { _type: 'exampleSentence', _key: uuid(), japanese: '田中さんが来ました。', romaji: 'Tanaka-san ga kimashita.', english: 'Tanaka-san is the one who came.' },
    
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '3.2 Existence (with arimasu/imasu)' }] },
    { _type: 'exampleSentence', _key: uuid(), japanese: '猫がいます。', romaji: 'Neko ga imasu.', english: 'There is a cat.' },

    // 4. Comparison Table (Simulated in blocks)
    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '4. は vs が – The Most Important Comparison' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'は (wa) = Focus on the COMMENT (the part after は)' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'が (ga) = Focus on the SUBJECT (the part before が)' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'Mental Shortcut: は = "As for...", が = "THIS is the one!"', marks: ['strong'] }] },

    // 5. Advanced Uses
    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '5. Advanced Uses' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'が is used with adjectives like "suki" (like) or "wakaru" (understand).' }] },
    { _type: 'exampleSentence', _key: uuid(), japanese: '日本語がわかります。', romaji: 'Nihongo ga wakarimasu.', english: 'I understand Japanese.' },

    // 6. Common Mistakes
    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '6. Common Mistakes' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '❌ 私はリンゴが好きです。 (Used は for preference incorrectly)' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '✅ 私はリンゴが好きです。 (Actually, this is okay, but が is more specific!)' }] },

    // 7. Practice Exercises
    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '7. Practice Exercises' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'Fill in the blank: 誰 [  ] 来ましたか？' }] },

    // 8. Summary
    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '8. Summary' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'が identifies the subject. It is used for existence, ability, and preference.' }] }
  ]
}

async function seed() {
  console.log('🚀 Seeding Chapter 4: Particle が...')
  try {
    await client.createOrReplace(chapterGa)
    console.log('✅ Done!')
  } catch (err) {
    console.error('❌ Error:', err)
  }
}

seed()
