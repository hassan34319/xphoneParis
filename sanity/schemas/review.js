export default {
  name: "review",
  title: "Review",
  type: "object",
  fields: [
    {
      name: "user",
      title: "User",
      type: "string",
    },
    {
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (Rule) => Rule.min(1).max(5).precision(1),
    },
    {
      name: "reviewText",
      title: "Review Text",
      type: "text",
    },
    {
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image" }],
    },
    {
      name: "videos",
      title: "Videos",
      type: "array",
      of: [{ type: "file" }],
    },
    {
      name: "date",
      title: "Date",
      type: "datetime",
      options: {
        dateFormat: "YYYY-MM-DD",
        timeFormat: "HH:mm",
        inputUtc: true,
      },
      initialValue: () => new Date().toISOString(),
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
    // Add any other fields relevant to your reviews
  ],
};
