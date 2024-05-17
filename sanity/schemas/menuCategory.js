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
        name: 'products',
        title: 'Products',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'product' }] }],
        description: 'Select the products belonging to this category',
      },
    ],
  };