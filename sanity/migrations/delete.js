import { sanityClient } from '@sanity/client'

// Initialize the Sanity client
const client = sanityClient({
    name: 'default',
    title: 'My Sanity Project',
    projectId: 'onzgpdr3', // Replace with your project ID
    dataset: 'production',
  useCdn: false
})

// Delete product function
async function deleteProduct() {
    try {
      // First, find the document with title "iPhone 8"
      const query = `*[_type == "product" && title == "iPhone 8"][0]._id`
      const documentId = await client.fetch(query)
      
      if (!documentId) {
        console.error('Product not found')
        return
      }
  
      // Delete the document
      const result = await client.delete(documentId)
      console.log(`Successfully deleted product with ID: ${result}`)
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

// Execute the deletion
deleteProduct()