import { defineField, defineType } from 'sanity'

export const socraticPrompt = defineType({
  name: 'socraticPrompt',
  title: 'Socratic Prompt',
  type: 'object',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hint',
      title: 'Hint',
      type: 'text',
    }),
    defineField({
      name: 'explanation',
      title: 'Explanation',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
  ],
})

export default defineType({
  name: 'understand',
  title: 'Understand',
  type: 'object',
  fields: [
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'socraticPrompt' }
      ],
    }),
  ],
})
