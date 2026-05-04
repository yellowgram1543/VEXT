import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'topic',
  title: 'Topic',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'module',
      title: 'Module',
      type: 'reference',
      to: [{ type: 'module' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
    }),
    defineField({
      name: 'understand',
      title: 'Understand Stage',
      type: 'object',
      fields: [
        defineField({
          name: 'placeholder',
          type: 'string',
          initialValue: 'Stage implementation pending'
        })
      ]
    }),
    defineField({
      name: 'reinforce',
      title: 'Reinforce Stage',
      type: 'object',
      fields: [
        defineField({
          name: 'placeholder',
          type: 'string',
          initialValue: 'Stage implementation pending'
        })
      ]
    }),
  ],
})
