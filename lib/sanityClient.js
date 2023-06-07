import SanityClient from "@sanity/client";

import imageUrlBuilder from "@sanity/image-url";

export const sanityClient = SanityClient({
  projectId: "onzgpdr3",
  dataset: "production",
  apiVersion: "2022-09-05",
  useCdn: "true",
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
});

// export const sanityClient = SanityClient({
//   projectId: "1usi5t68",
//   dataset: "production",
//   apiVersion: "2022-09-05",
//   useCdn: "true",
//   token: process.env.NEXT_PUBLIC_SANITY_TOKEN_TEST,
// });

const builder = imageUrlBuilder(sanityClient);

export const urlFor = (source) => builder.image(source);
