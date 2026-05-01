export const authResponses = {
  InvalidCredentials: {
    description: "Invalid credentials",
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/ErrorResponse",
        },
        examples: {
          invalidCredentials: {
            value: {
              error: "Invalid credentials",
            },
          },
        },
      },
    },
  },
};