export const xweetsPaths = {
  "/xweets": {
    post: {
      tags: ["Xweets"],
      summary: "Create a xweet",
      description: "Creates a new xweet for the authenticated user.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateXweetBody",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Xweet created successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/XweetResponse",
              },
            },
          },
        },
        400: {
          $ref: "#/components/responses/BadRequest",
        },
        401: {
          $ref: "#/components/responses/Unauthorized",
        },
      },
    },
  },

  "/xweets/{id}/reply": {
    post: {
      tags: ["Xweets"],
      summary: "Reply to a xweet",
      description: "Creates a reply linked to an existing xweet.",
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "Parent xweet id",
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateXweetBody",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Reply created successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/XweetResponse",
              },
            },
          },
        },
        400: {
          $ref: "#/components/responses/BadRequest",
        },
        401: {
          $ref: "#/components/responses/Unauthorized",
        },
        404: {
          $ref: "#/components/responses/NotFound",
        },
      },
    },
  },

  "/xweets/{id}/like": {
    post: {
      tags: ["Xweets"],
      summary: "Like a xweet",
      description: "Adds a like from the authenticated user to the target xweet.",
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "Xweet id",
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],
      responses: {
        200: {
          description: "Xweet liked successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MessageResponse",
              },
            },
          },
        },
        401: {
          $ref: "#/components/responses/Unauthorized",
        },
        404: {
          $ref: "#/components/responses/NotFound",
        },
        409: {
          $ref: "#/components/responses/Conflict",
        },
      },
    },

    delete: {
      tags: ["Xweets"],
      summary: "Remove like from a xweet",
      description: "Removes the authenticated user's like from the target xweet.",
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "Xweet id",
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],
      responses: {
        200: {
          description: "Like removed successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MessageResponse",
              },
            },
          },
        },
        401: {
          $ref: "#/components/responses/Unauthorized",
        },
        409: {
          $ref: "#/components/responses/Conflict",
        },
      },
    },
  },
};