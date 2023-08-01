export default {
  name: "comment",
  title: "Comment",
  type: "document",
  fields: [
    {
      name: "user",
      title: "User",
      type: "string",
    },
    {
      name: "content",
      title: "Content",
      type: "text",
    },
    {
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Approved", value: "approved" },
          { title: "Rejected", value: "rejected" },
        ],
      },
    },
    // Add any other comment fields you need
  ],
};
