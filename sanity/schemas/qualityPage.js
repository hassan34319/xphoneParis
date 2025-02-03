// schemas/qualityPage.js

export default {
    name: 'qualityPage',
    title: 'Quality Page',
    type: 'document',
    fields: [
      {
        name: 'logo',
        title: 'Logo',
        type: 'image',
        options: {
          hotspot: true
        }
      },
      {
        name: 'mainTitle',
        title: 'Main Title',
        type: 'string',
      },
      {
        name: 'subtitle',
        title: 'Subtitle',
        type: 'text',
      },
      {
        name: 'qualityFeatures',
        title: 'Quality Features',
        type: 'array',
        of: [{
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Feature Image',
              type: 'image',
              options: {
                hotspot: true
              }
            },
            {
              name: 'description',
              title: 'Feature Description',
              type: 'text',
            }
          ]
        }]
      }
    ]
  }