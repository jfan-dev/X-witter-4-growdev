export const usersPaths = {
  "/users/{id}": {
    get: {
      tags: ["Users"],
      summary: "Get a user profile",
      description: "Returns the user profile including xweets, followers, and following.",
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "User id",
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],
      responses: {
        200: {
          description: "User profile returned successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserProfileResponse",
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
      },
    },
  },

  "/users/{id}/follow": {
    post: {
      tags: ["Users"],
      summary: "Follow a user",
      description: "Makes the authenticated user follow the target user.",
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "Target user id",
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],
      responses: {
        200: {
          description: "User followed successfully",
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
          description: "User to follow not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        409: {
          $ref: "#/components/responses/Conflict",
        },
      },
    },

    delete: {
      tags: ["Users"],
      summary: "Unfollow a user",
      description: "Makes the authenticated user unfollow the target user.",
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "Target user id",
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],
      responses: {
        200: {
          description: "User unfollowed successfully",
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