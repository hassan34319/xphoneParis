export default {
  name: 'menuCategory',
  title: 'Menu Category',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The name of the menu category',
    },
    {
      name: 'priority',
      title: 'Priority',
      type: 'number',
      description: 'Set the display order (lower numbers appear first)',
      validation: Rule => Rule.required().integer().min(0),
    },
    {
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      description: 'Select the products belonging to this category',
    },
  ],
  orderings: [
    {
      title: 'Priority',
      name: 'priorityAsc',
      by: [{ field: 'priority', direction: 'asc' }]
    }
  ]
};