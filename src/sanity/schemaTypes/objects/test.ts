import { defineField, defineType } from 'sanity'

export const quizQuestion = defineType({
  name: 'quizQuestion',
  title: 'Quiz Question',
  type: 'object',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Scenario', value: 'scenario' },
          { title: 'Visual', value: 'visual' },
        ],
        layout: 'radio',
      },
      initialValue: 'scenario',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Visual Asset',
      type: 'image',
      hidden: ({ parent }) => parent?.type !== 'visual',
    }),
    defineField({
      name: 'options',
      title: 'Options',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required().min(2),
    }),
    defineField({
      name: 'correctAnswer',
      title: 'Correct Answer (Index)',
      description: 'The 0-based index of the correct option',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
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
  name: 'test',
  title: 'Test Stage',
  type: 'object',
  fields: [
    defineField({
      name: 'questions',
      title: 'Quiz Questions',
      type: 'array',
      of: [{ type: 'quizQuestion' }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
})
