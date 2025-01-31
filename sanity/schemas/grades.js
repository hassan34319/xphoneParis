// schemas/gradesPage.js
export default {
    name: 'grades',
    title: 'Grades Page',
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
        name: 'grades',
        title: 'Grades',
        type: 'array',
        of: [{
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Grade Title',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Grade Description',
              type: 'text',
            },
            {
              name: 'starRating',
              title: 'Star Rating (1-5)',
              type: 'number',
              validation: Rule => Rule.min(1).max(5)
            },
            {
              name: 'images',
              title: 'Grade Images',
              type: 'array',
              of: [{
                type: 'object',
                fields: [
                  {
                    name: 'image',
                    title: 'Image',
                    type: 'image',
                    options: {
                      hotspot: true
                    }
                  }
                ]
              }]
            }
          ]
        }]
      }
    ]
  }