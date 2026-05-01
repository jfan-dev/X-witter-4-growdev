export const healthPaths = {
  "/health": {
    get: {
      tags: ["Health"],
      summary: "Health check",
      description: "Returns the API health status.",
      security: [],
      responses: {
        200: {
          description: "API is healthy",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/HealthResponse",
              },
            },
          },
        },
      },
    },
  },
};