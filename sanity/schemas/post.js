export default {
    name: 'post',
    title: 'Post',
    type: 'array',
    of: [{
      type: 'block',
      // Customizations for basic styling
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'Quote', value: 'blockquote' }
      ],
      // Basic marks for inline styling
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
        ],
      }
    }]
  }