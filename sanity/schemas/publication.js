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
  ],
};
