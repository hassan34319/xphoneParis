export default {
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
    },
    {
      name: "brand",
      title: "Brand",
      type: "string",
    },
    {
      name: "category",
      title: "Category",
      type: "string",
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "desc",
      title: "Desc",
      type: "string",
    },
    {
      name: "variants",
      title: "Variants",
      type: "array",
      of: [{ type: "variant" }],
    },
    {
      name: "accessories",
      title: "Accessories",
      type: "array",
      of: [{ type: "accessories" }],
    },
    {
      name: "categoryReal",
      title: "Category Real",
      type: "reference",
      to: [{ type: "categoryReal" }],
    },
    {
      name: "brandReal",
      title: "Brand Real",
      type: "reference",
      to: [{ type: "brandReal" }],
    },
    {
      name: "width",
      title: "Width",
      type: "number",
    },
    {
      name: "height",
      title: "Height",
      type: "number",
    },
    {
      name: "length",
      title: "Length",
      type: "number",
    },
    {
      name: "weigth",
      title: "Weigth",
      type: "number",
    },
    {
      name: "priority",
      title: "Priority",
      type: "number",
    },
    {
      name: "review",
      title: "Review",
      type: "array",
      of: [{ type: "review" }]
    },
  ],
};