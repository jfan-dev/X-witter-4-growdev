export const commonResponses = {
  BadRequest: {
    description: "Bad request",
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/ErrorResponse",
        },
        examples: {
          badRequest: {
            value: {
              error: "Bad request",
            },
          },
        },
      },
    },
  },

  Unauthorized: {
    description: "Missing or invalid authentication token",
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/ErrorResponse",
        },
        examples: {
          missingOrInvalidToken: {
            value: {
              error: "Token missing or invalid",
            },
          },
        },
      },
    },
  },

  NotFound: {
    description: "Resource not found",
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/ErrorResponse",
        },
        examples: {
          notFound: {
            value: {
              error: "Resource not found",
            },
          },
        },
      },
    },
  },

  Conflict: {
    description: "Conflict with current resource state",
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/ErrorResponse",
        },
        examples: {
          conflict: {
            value: {
              error: "Conflict",
            },
          },
        },
      },
    },
  },
};