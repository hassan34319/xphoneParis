// schemas/quiSommes.js
export default {
  name: 'quiSommes',
  title: 'Qui Sommes',
  type: 'document',
  fields: [
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      validation: Rule => Rule.required()
    },
    {
      name: 'heroVideo',
      title: 'Hero Video',
      type: 'file',
      options: {
        accept: 'video/*'
      }
    },
    {
      name: 'threeFeatureImages',
      title: 'Three Feature Images',
      type: 'array',
      of: [{ type: 'image' }],
      validation: Rule => Rule.length(3)
    },
    {
      name: 'frenchProductsSection',
      title: 'French Section Images',
      type: 'object',
      fields: [
        {
          name: 'girlImage',
          title: 'Girl Image',
          type: 'image'
        },
        {
          name: 'stopImage',
          title: 'Stop Image',
          type: 'image'
        },
        {
          name: 'coqImage',
          title: 'French Coq Image',
          type: 'image'
        },
        {
          name: 'phoneImage',
          title: 'Phone Image',
          type: 'image'
        }
      ]
    },
    {
      name: 'marketplaceImages',
      title: 'Marketplace Images',
      type: 'array',
      of: [{ type: 'image' }],
      validation: Rule => Rule.length(4)
    },
    {
      name: 'storeImages',
      title: 'Store Images',
      type: 'array',
      of: [{ type: 'image' }],
      validation: Rule => Rule.length(2)
    }
  ]
}