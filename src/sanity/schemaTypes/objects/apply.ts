import { defineField, defineType } from 'sanity'

export const sandboxConfig = defineType({
  name: 'sandboxConfig',
  title: 'Sandbox Configuration',
  type: 'object',
  fields: [
    defineField({
      name: 'runtime',
      title: 'Runtime',
      type: 'string',
      options: {
        list: [
          { title: 'Node.js', value: 'nodejs' },
          { title: 'Python', value: 'python' },
          { title: 'React', value: 'react' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'entryPoint',
      title: 'Entry Point File',
      type: 'string',
      initialValue: 'index.js',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'requirements',
      title: 'Project Requirements',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
})

export default defineType({
  name: 'apply',
  title: 'Apply Stage',
  type: 'object',
  fields: [
    defineField({
      name: 'instruction',
      title: 'Instruction',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'spec',
      title: 'Project Specification',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sandbox',
      title: 'Sandbox Config',
      type: 'sandboxConfig',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
