export const usersPaths = {
  "/users/search": {
    get: {
      tags: ["Users"],
      summary: "Search users by name or email",
      description:
        "Search authenticated users by partial name or email. Returns a limited list of matching users without passwords.",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "query",
          in: "query",
          required: true,
          description: "Name or email text to search for. Minimum 2 characters.",
          schema: {
            type: "string",
            minLength: 2,
            example: "ana",
          },
        },
      ],
      responses: {
        200: {
          description: "Users found successfully",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                      example: "clx123abc456",
                    },
                    name: {
                      type: "string",
                      example: "Ana Silva",
                    },
                    email: {
                      type: "string",
                      example: "ana@example.com",
                    },
                    profileImage: {
                      type: "string",
                      nullable: true,
                      example: "https://ui-avatars.com/api/?name=Ana%20Silva",
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid search query",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Search must have at least 2 characters",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Unauthorized - missing or invalid JWT token",
        },
      },
    },
  },
  
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