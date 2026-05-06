import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'reinforce',
  title: 'Reinforce',
  type: 'object',
  fields: [
    defineField({
      name: 'practices',
      title: 'Practices',
      type: 'array',
      of: [
        {
          type: 'code',
          options: {
            language: 'python',
            languageAlternatives: [
              { title: 'Python', value: 'python' },
              { title: 'JavaScript', value: 'javascript' },
              { title: 'SQL', value: 'sql' },
            ],
          },
        },
        { type: 'latex' },
      ],
    }),
  ],
})
