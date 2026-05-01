export const authPaths = {
  "/auth/signup": {
    post: {
      tags: ["Auth"],
      summary: "Register a new user",
      description: "Creates a new account and returns the created user without the password.",
      security: [],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/SignUpBody",
            },
          },
        },
      },
      responses: {
        201: {
          description: "User created successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AuthSignupResponse",
              },
            },
          },
        },
        409: {
          $ref: "#/components/responses/Conflict",
        },
      },
    },
  },

  "/auth/signin": {
    post: {
      tags: ["Auth"],
      summary: "Sign in and receive a JWT",
      description: "Authenticates a user with email and password.",
      security: [],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/SignInBody",
            },
          },
        },
      },
      responses: {
        200: {
          description: "JWT token returned",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AuthTokenResponse",
              },
            },
          },
        },
        401: {
          $ref: "#/components/responses/InvalidCredentials",
        },
      },
    },
  },
};