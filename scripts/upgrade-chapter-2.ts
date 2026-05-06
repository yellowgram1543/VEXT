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

const chapterNumbersExhaustive = {
  _type: 'chapter',
  _id: 'chapter-n5-02',
  title: 'Ultimate Guide: Numbers + Essential Counters',
  slug: { _type: 'slug', current: 'numbers-counters' },
  order: 2,
  module: { _type: 'reference', _ref: 'module-n5-foundation' },
  content: [
    // 1. Introduction
    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '1. Introduction: The Logic of Japanese Numbers' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'Japanese numbers are incredibly logical. Once you learn 1–10, you can count to 99 just by combining them. However, counting objects requires special "suffixes" called counters.' }] },

    // 2. Basic Structure: 1 to 100
    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '2. Basic Structure: Counting to 100' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '1: Ichi, 2: Ni, 3: San, 4: Yon/Shi, 5: Go, 6: Roku, 7: Nana/Shichi, 8: Hachi, 9: Kyuu, 10: Juu.' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'Pattern: 11 is Juu + Ichi (10+1). 20 is Ni + Juu (2x10). 21 is Ni-juu-ichi.' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'Big Numbers: 100 (Hyaku), 1,000 (Sen), 10,000 (Man).' }] },

    // 3. Detailed Examples & Time
    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '3. Core Uses & Time Expressions' }] },
    { _type: 'exampleSentence', _key: uuid(), japanese: '今は三時半です。', romaji: 'Ima wa san-ji han desu.', english: 'It is 3:30 now (ji = hour, han = half).' },
    { _type: 'exampleSentence', _key: uuid(), japanese: '電話番号は 090-1234-5678 です。', romaji: 'Denwa bangou wa 090-1234-5678 desu.', english: 'My phone number is...' },

    // 4. Essential N5 Counters Comparison
    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '4. Essential N5 Counters List' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '• ～つ (tsu): General counter for objects (Hitotsu, Futatsu, Mittsu...).' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '• ～人 (nin): For people (Hitori, Futari, Sannin...).' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '• ～枚 (mai): For flat things (paper, shirts).' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '• ～本 (hon): For long things (pens, bottles, umbrellas).' }] },

    // 5. Advanced Insight: Irregular Pronunciations
    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '5. Advanced Insight: Watch the Irregulars!' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'Some counters change the number pronunciation. For example, 1 minute is "Ippun", not "Ichifun". 1 person is "Hitori", not "Ichinin".' }] },

    // 6. Common Mistakes
    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '6. Common Mistakes' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '• Using "Yon" vs "Shi": Usually, "Yon" is safer for counting objects.' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '• Forgetting the counter: You cannot just say "two books" as "ni hon". You must say "hon ga ni-satsu".' }] },

    // 7. Practice Exercises
    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '7. Micro Practice' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '1. What is 42 in Japanese? [ Yon-juu-ni ]' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '2. Count 2 people: [ Futari ]' }] },

    // 8. Summary & Mastery Links
    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '8. Summary & Next Steps' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'Mastering numbers allows you to shop, tell time, and talk about your family.' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'External Deep Dive: ', marks: ['strong'] }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '• Essential Counters List: https://jlptsensei.com/japanese-counters-list/' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '• Telling Time Guide: https://www.tanos.co.uk/jlpt/skills/vocab/time/' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '• Number Practice: https://jlptsensei.com/japanese-numbers-1-100/' }] }
  ]
}

async function seed() {
  console.log('🚀 Upgrading Chapter 2 to Exhaustive Edition...')
  try {
    await client.createOrReplace(chapterNumbersExhaustive)
    console.log('✅ Done!')
  } catch (err) {
    console.error('❌ Error:', err)
  }
}

seed()
