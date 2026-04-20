export default {
  name: 'chapter',
  title: 'Chapter (Lesson)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'module',
      title: 'Parent Module',
      type: 'reference',
      to: [{ type: 'module' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'order',
      title: 'Order within Module',
      type: 'number',
    },
    {
      name: 'content',
      title: 'Lesson Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [{ title: 'Bullet', value: 'bullet' }],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Japanese', value: 'japanese' }, // Custom decorator for JA text
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'URL',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
        },
        {
          name: 'exampleSentence',
          type: 'object',
          title: 'Example Sentence',
          fields: [
            { name: 'japanese', type: 'string', title: 'Japanese' },
            { name: 'romaji', type: 'string', title: 'Romaji' },
            { name: 'english', type: 'string', title: 'English' },
          ],
        },
      ],
    },
  ],
}
