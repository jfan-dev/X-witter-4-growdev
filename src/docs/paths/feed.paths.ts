export const feedPaths = {
  "/feed": {
    get: {
      tags: ["Feed"],
      summary: "Get the authenticated user's feed",
      description:
        "Returns the authenticated user's own xweets plus xweets from followed users, ordered by newest first.",
      responses: {
        200: {
          description: "Feed returned successfully",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/FeedXweetResponse",
                },
              },
            },
          },
        },
        401: {
          $ref: "#/components/responses/Unauthorized",
        },
      },
    },
  },
};