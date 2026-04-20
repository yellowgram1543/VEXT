export default {
  name: 'module',
  title: 'Module',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'level',
      title: 'JLPT Level',
      type: 'string',
      options: {
        list: [
          { title: 'N5', value: 'N5' },
          { title: 'N4', value: 'N4' },
          { title: 'N3', value: 'N3' },
          { title: 'N2', value: 'N2' },
          { title: 'N1', value: 'N1' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'order',
      title: 'Order',
      type: 'number',
    },
  ],
}
