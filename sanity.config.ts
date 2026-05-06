import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { codeInput } from '@sanity/code-input'
import { latexInput } from 'sanity-plugin-latex-input'
import { schemaTypes } from './src/sanity/schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'ML Cognitive Coach',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  basePath: '/studio',

  plugins: [
    deskTool(),
    codeInput(),
    latexInput(),
  ],

  schema: {
    types: schemaTypes,
  },
})
