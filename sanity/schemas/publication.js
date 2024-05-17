export default {
  name: "publication",
  title: "Publication",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "content",    
      title: "Content",
      type: "string",
    },
    {
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "video",
      title: "Video",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "likes",
      title: "Likes",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "comments",
      title: "Comments",
      type: "array",
      of: [{ type: "comment" }],
    },
    {
      name: "username",
      title: "Username",
      type: "string",
    },
    {
      name: "userImage",
      title: "User Image",
      type: "string", // Assuming user image is stored as a URL
    },
    {
      name: "approved",
      title: "Approved",
      type: "boolean",
    },
    {
      name: "buttonText",
      title: "Button Text",
      type: "string",
    },
    {
      name: "productReference",
      title: "Product Reference",
      type: "reference",
      to: [{ type: 'product' }]
    },
  ],
};
