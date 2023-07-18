import { BiCategory } from "react-icons/bi";

export default {
  name: "categoryReal",
  title: "Category Real",
  type: "document",
  icon: BiCategory,
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    },
    {
      name: "brandsReal",
      title: "Brands",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "subcategories",
      title: "Subcategories",
      type: "array",
      of: [{ type: "string" }],
    },
  ],
}