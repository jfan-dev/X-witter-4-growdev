export const feedSchemas = {
  FeedAuthorSummary: {
    type: "object",
    properties: {
      id: {
        type: "string",
        format: "uuid",
        example: "54d70f3e-dbc9-4c85-9ccc-9b940f276cda",
      },
      name: {
        type: "string",
        example: "John Doe",
      },
      profileImage: {
        type: "string",
        format: "uri",
        example: "https://ui-avatars.com/api/?name=John%20Doe",
      },
    },
  },

  FeedXweetResponse: {
    type: "object",
    properties: {
      id: {
        type: "string",
        format: "uuid",
        example: "a33109c3-2bab-4a4c-8e43-c12b9bfa8614",
      },
      content: {
        type: "string",
        example: "Hello world from John 🚀",
      },
      createdAt: {
        type: "string",
        format: "date-time",
        example: "2026-04-15T19:15:51.950Z",
      },
      authorId: {
        type: "string",
        format: "uuid",
        example: "54d70f3e-dbc9-4c85-9ccc-9b940f276cda",
      },
      parentId: {
        type: "string",
        format: "uuid",
        nullable: true,
        example: null,
      },
      author: {
        $ref: "#/components/schemas/FeedAuthorSummary",
      },
    },
  },
};