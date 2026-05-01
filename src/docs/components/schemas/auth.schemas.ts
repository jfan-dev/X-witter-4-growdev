export const authSchemas = {
  SignUpBody: {
    type: "object",
    required: ["name", "email", "password", "birthdate"],
    properties: {
      name: {
        type: "string",
        example: "John Doe",
      },
      email: {
        type: "string",
        format: "email",
        example: "john@example.com",
      },
      password: {
        type: "string",
        format: "password",
        example: "123456",
      },
      birthdate: {
        type: "string",
        format: "date",
        example: "2000-01-01",
      },
    },
  },

  SignInBody: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: {
        type: "string",
        format: "email",
        example: "john@example.com",
      },
      password: {
        type: "string",
        format: "password",
        example: "123456",
      },
    },
  },

  AuthTokenResponse: {
    type: "object",
    properties: {
      token: {
        type: "string",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example",
      },
    },
  },

  AuthSignupResponse: {
    type: "object",
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },
      name: {
        type: "string",
        example: "John Doe",
      },
      email: {
        type: "string",
        format: "email",
        example: "john@example.com",
      },
      birthdate: {
        type: "string",
        format: "date-time",
      },
      profileImage: {
        type: "string",
        format: "uri",
        example: "https://ui-avatars.com/api/?name=John%20Doe",
      },
    },
  },
};