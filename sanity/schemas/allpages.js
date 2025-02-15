export default {
    name: 'page',
    title: 'Pages',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Page Title',
        type: 'string',
      },
      {
        name: 'pageName',
        title: 'Page Name',
        type: 'slug',
        options: {
          source: 'title',
          maxLength: 96
        }
      },
      {
        name: 'order',
        title: 'Page Order',
        type: 'number'
      }
    ],
    preview: {
      select: {
        title: 'title',
        subtitle: 'pageName.current'
      }
    }
  }