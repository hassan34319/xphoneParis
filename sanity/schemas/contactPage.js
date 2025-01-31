// schemas/contactPage.js
export default {
    name: 'contactPage',
    title: 'Contact Page',
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
        name: 'storeRepublique',
        title: 'Store Republique Image',
        type: 'image',
        options: {
          hotspot: true
        }
      },
      {
        name: 'storeNation',
        title: 'Store Nation Image',
        type: 'image',
        options: {
          hotspot: true
        }
      },
      {
        name: 'phoneIcon',
        title: 'Phone Icon',
        type: 'image',
        options: {
          hotspot: true
        }
      },
      {
        name: 'emailIcon',
        title: 'Email Icon',
        type: 'image',
        options: {
          hotspot: true
        }
      },
      {
        name: 'emailAgent',
        title: 'Email Agent',
        type: 'image',
        options: {
          hotspot: true
        }
      },
      {
        name: 'phoneAgent',
        title: 'Phone Agent',
        type: 'image',
        options: {
          hotspot: true
        }
      }
    ]
  }