// schemas/quiSommes.js
export default {
  name: "quiSommes",
  title: "Qui Sommes",
  type: "document",
  fields: [
    {
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true }, // Added hotspot
      validation: (Rule) => Rule.required(),
    },
    {
      name: "heroVideo",
      title: "Hero Video",
      type: "file",
      options: {
        accept: "video/*",
      },
    },
    {
      name: "threeFeatureImages",
      title: "Three Feature Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }], // Added hotspot
      validation: (Rule) => Rule.length(3),
    },
    {
      name: "frenchProductsSection",
      title: "French Section Images",
      type: "object",
      fields: [
        {
          name: "girlImage",
          title: "Girl Image",
          type: "image",
          options: { hotspot: true }, // Added hotspot
        },
        {
          name: "stopImage",
          title: "Stop Image",
          type: "image",
          options: { hotspot: true }, // Added hotspot
        },
        {
          name: "coqImage",
          title: "French Coq Image",
          type: "image",
          options: { hotspot: true }, // Added hotspot
        },
        {
          name: "phoneImage",
          title: "Phone Image",
          type: "image",
          options: { hotspot: true }, // Added hotspot
        },
      ],
    },
    {
      name: "marketplaceImages",
      title: "Marketplace Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }], // Added hotspot
      validation: (Rule) => Rule.length(4),
    },
    {
      name: "storeImages",
      title: "Store Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }], // Added hotspot
      validation: (Rule) => Rule.length(2),
    },
  ],
};
