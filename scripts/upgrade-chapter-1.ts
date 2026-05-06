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

const chapterHiraganaExhaustive = {
  _type: 'chapter',
  _id: 'chapter-n5-01',
  title: 'Ultimate Guide: Hiragana + Katakana',
  slug: { _type: 'slug', current: 'hiragana-katakana' },
  order: 1,
  module: { _type: 'reference', _ref: 'module-n5-foundation' },
  content: [
    // 1. Introduction
    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '1. Introduction: The Soul of Japanese' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'To master Japanese, you must stop relying on Romaji (English letters). Japanese uses three scripts: ' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '• Hiragana: Curvy, used for native words and grammar (e.g., desu, wa).' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '• Katakana: Angular, used for foreign loanwords (e.g., kohi, terebi).' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '• Kanji: Logograms for meaning (learned later).' }] },

    // 2. Basic Structure: The 46 Sounds
    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '2. Basic Structure: The Grid' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'Both scripts share the same 46 sounds based on 5 vowels: A, I, U, E, O.' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'Vowels: あ(a) い(i) う(u) え(e) お(o)' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'K-Row: か(ka) き(ki) く(ku) け(ke) こ(ko)' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'S-Row: さ(sa) し(shi*) す(su) せ(se) そ(so)' }] },

    // 3. Detailed Examples & Pronunciation
    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '3. Core Uses & Interactive Examples' }] },
    { _type: 'exampleSentence', _key: uuid(), japanese: 'こんにちは', romaji: 'Konnichiwa', english: 'Hello (Pure Hiragana).' },
    { _type: 'exampleSentence', _key: uuid(), japanese: 'パン', romaji: 'Pan', english: 'Bread (Katakana - from Portuguese "pão").' },
    { _type: 'exampleSentence', _key: uuid(), japanese: 'すし', romaji: 'Sushi', english: 'Sushi (Hiragana for a native Japanese dish).' },

    // 4. Comparison Table: Hiragana vs Katakana
    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '4. Visual Comparison' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'Hiragana (Curvy): あ か さ た な' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'Katakana (Sharp): ア カ サ タ ナ' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'Rule: If it is a name like "John" or "London", it MUST be Katakana: ジョン, ロンドン.', marks: ['strong'] }] },

    // 5. Advanced Insight: Dakuten, Handakuten, and Yōon
    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '5. Advanced Insight: Modifying Sounds' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '• Dakuten ("): Changes unvoiced to voiced (ka → ga, sa → za, ta → da, ha → ba).' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '• Handakuten (°): Only for Ha-row (ha → pa).' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '• Yōon: Combining a character with a small ya, yu, or yo (e.g., Ki + small ya = Kya).' }] },
    { _type: 'exampleSentence', _key: uuid(), japanese: 'じゅぎょう', romaji: 'Jugyou', english: 'Class/Lesson (Uses voiced "ji" and small "yu").' },

    // 6. Common Mistakes
    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '6. Common Mistakes' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '• Shī (シ) vs. Tsu (ツ): Look at the stroke direction (sideways vs. vertical).' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '• Long Vowels: In Katakana, use a dash (ー) like コーヒー. In Hiragana, add a vowel like おかあさん.' }] },

    // 7. Practice Exercises
    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '7. Micro Practice' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '1. Read this word: サッカー (Sakkaa - Soccer)' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '2. Write "Tomato" in Katakana: [ トマト ]' }] },

    // 8. Summary & Mastery Links
    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '8. Summary & Next Steps' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'Mastering the scripts is 50% of the N5 battle. Download a writing app or use physical flashcards.' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'External Deep Dive: ', marks: ['strong'] }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '• Hiragana Chart: https://jlptsensei.com/japanese-hiragana-chart/' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '• Katakana Chart: https://jlptsensei.com/japanese-katakana-chart/' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '• Writing Practice: https://www.tanos.co.uk/jlpt/skills/writing/' }] }
  ]
}

async function seed() {
  console.log('🚀 Upgrading Chapter 1 to Exhaustive Edition...')
  try {
    await client.createOrReplace(chapterHiraganaExhaustive)
    console.log('✅ Done!')
  } catch (err) {
    console.error('❌ Error:', err)
  }
}

seed()
