export const menuCategory = {
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
      name: 'hasSubcategories',
      title: 'Has Subcategories',
      type: 'boolean',
      description: 'Enable this if this category should show subcategories before products',
      initialValue: false,
    },
    {
      name: 'subcategories',
      title: 'Subcategories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'menuCategory2' }] }],
      description: 'Select subcategories (if applicable)',
      hidden: ({ document }) => !document?.hasSubcategories,
    },
    {
      name: 'products',
      title: 'Direct Products',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      description: 'Select products (only if not using subcategories)',
      hidden: ({ document }) => document?.hasSubcategories,
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

export default menuCategory;