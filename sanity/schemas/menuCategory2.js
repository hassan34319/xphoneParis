export const menuCategory2 = {
    name: 'menuCategory2',
    title: 'menuSubCategory',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
        description: 'The name of the subcategory (e.g., iPhone 13, iPhone 14)',
      },
     
      {
        name: 'products',
        title: 'Products',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'product' }] }],
        description: 'Select the products belonging to this subcategory',
      },
    ],
   
  };
  
  export default menuCategory2;