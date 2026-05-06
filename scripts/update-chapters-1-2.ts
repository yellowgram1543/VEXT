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

const chapterHiragana = {
  _type: 'chapter',
  _id: 'chapter-n5-01',
  title: 'Hiragana + Katakana',
  slug: { _type: 'slug', current: 'hiragana-katakana' },
  order: 1,
  module: { _type: 'reference', _ref: 'module-n5-foundation' },
  content: [
    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '1. Introduction' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'Japanese uses three scripts. Hiragana is the primary script for native words and grammar, while Katakana is used for foreign loanwords and emphasis.' }] },
    
    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '2. Basic Structure' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'Both scripts consist of 46 basic characters representing syllables. They follow the same phonetic structure (A-I-U-E-O).' }] },
    
    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '3. Core Uses with Detailed Examples' }] },
    { _type: 'exampleSentence', _key: uuid(), japanese: 'あいうえお', romaji: 'A-I-U-E-O', english: 'The basic vowels in Hiragana.' },
    { _type: 'exampleSentence', _key: uuid(), japanese: 'アメリカ', romaji: 'Amerika', english: 'America (Written in Katakana as it is a foreign name).' },

    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '4. Hiragana vs Katakana Comparison' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'Hiragana is curvy and used for native words. Katakana is sharp/angular and used for foreign words.' }] },

    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '5. Advanced Insight: Dakuten and Handakuten' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'Small marks like " and ° change the sound of characters (e.g., "ha" becomes "ba" or "pa").' }] },

    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '6. Common Mistakes' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'Mixing up similar characters like "shi" (し) and "tsu" (つ).' }] },

    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '7. Practice Exercises' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'Identify the Katakana: コーヒー (Hint: It means Coffee)' }] },

    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '8. Summary' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'Mastering these two scripts is the first step to reading Japanese fluently.' }] }
  ]
}

const chapterNumbers = {
  _type: 'chapter',
  _id: 'chapter-n5-02',
  title: 'Numbers + Counters',
  slug: { _type: 'slug', current: 'numbers-counters' },
  order: 2,
  module: { _type: 'reference', _ref: 'module-n5-foundation' },
  content: [
    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '1. Introduction' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'Numbers in Japanese are very logical, but counting specific objects requires "counters"—special suffixes added to numbers.' }] },
    
    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '2. Basic Structure' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'Numbers 1-10: Ichi, Ni, San, Yon/Shi, Go, Roku, Nana/Shichi, Hachi, Kyuu, Juu.' }] },
    
    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '3. Core Uses with Detailed Examples' }] },
    { _type: 'exampleSentence', _key: uuid(), japanese: '三時です。', romaji: 'San-ji desu.', english: 'It is 3 o\'clock. (ji is the counter for hours)' },
    { _type: 'exampleSentence', _key: uuid(), japanese: 'りんごが二つあります。', romaji: 'Ringo ga futatsu arimasu.', english: 'There are two apples. (tsu is the general counter)' },

    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '4. Counters Comparison' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: '～人 (nin) for people, ～枚 (mai) for flat objects, ～本 (hon) for long objects.' }] },

    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '5. Advanced Insight: The number 4, 7, and 9' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'These numbers have multiple pronunciations depending on the context due to lucky/unlucky associations.' }] },

    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '6. Common Mistakes' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'Using the wrong counter for the object type (e.g., using "nin" for a car).' }] },

    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '7. Practice Exercises' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'How do you say "1 o\'clock" in Japanese?' }] },

    { _type: 'block', _key: uuid(), style: 'h3', children: [{ _type: 'span', text: '8. Summary' }] },
    { _type: 'block', _key: uuid(), children: [{ _type: 'span', text: 'Numbers are easy; counters are the key to sounding natural!' }] }
  ]
}

async function seed() {
  console.log('🚀 Updating Chapters 1 & 2...')
  try {
    await client.createOrReplace(chapterHiragana)
    await client.createOrReplace(chapterNumbers)
    console.log('✅ Done!')
  } catch (err) {
    console.error('❌ Error:', err)
  }
}

seed()
