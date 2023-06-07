export default {
  name: "variant",
  title: "Variant",
  type: "object",
  fields: [
    {
      name: "sub",
      title: "Sub",
      type: "string",
    },
    {
      name: "price",
      title: "Price",
      type: "number",
    },
    {
      name: "capacity",
      title: "Capacity",
      type: "number",
    },
    {
      name: "grade",
      title: "Grade",
      type: "string",
    },
    {
      name: "color",
      title: "Color",
      type: "string",
    },
    {
      name: "image",
      title: "Image",
      type: "image",
      options: {
        useHotspot: true,
      },
    },
    {
      name: "quantity",
      title: "Quantity",
      type: "number",
    },
  ],
};
