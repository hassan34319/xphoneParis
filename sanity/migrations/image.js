import sanityClient from 'part:@sanity/base/client'

const client = sanityClient.withConfig({
  apiVersion: '2021-03-25'
})

// Fetch all products where variants have `null` images
const fetchDocuments = () =>
  client.fetch(
    `*[_type == "product" && count(variants[image == null]) > 0] {
      _id,
      _rev,
      variants[] {
        _key,
        image
      }
    }`
  )

const buildPatches = docs =>
  docs.map(doc => ({
    id: doc._id,
    patch: {
      set: {
        variants: doc.variants.map(variant => ({
          _key: variant._key,
          ...variant,
          image: variant.image === null
            ? {
                _type: "image",
                asset: {
                  _type: "reference",
                  _ref: "your-default-image-asset-id" // Replace with a valid image asset ID
                }
              }
            : variant.image
        }))
      },
      ifRevisionID: doc._rev
    }
  }))

const createTransaction = patches =>
  patches.reduce((tx, patch) => tx.patch(patch.id, patch.patch), client.transaction())

const commitTransaction = tx => tx.commit()

const fixNullImages = async () => {
  const documents = await fetchDocuments()
  const patches = buildPatches(documents)

  if (patches.length === 0) {
    console.log('No documents with null images found!')
    return null
  }

  console.log(
    `Fixing null images for:\n %s`,
    patches.map(patch => `${patch.id} => ${JSON.stringify(patch.patch)}`).join('\n')
  )

  const transaction = createTransaction(patches)
  await commitTransaction(transaction)
  return fixNullImages()
}

fixNullImages().catch(err => {
  console.error(err)
  process.exit(1)
})
