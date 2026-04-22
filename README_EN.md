# X-uitter API

REST API for a Twitter-like social network MVP built with **Node.js**, **TypeScript**, **Express.js**, **PostgreSQL**, and **Prisma ORM**.

## Overview

X-uitter is a backend API where authenticated users can:

- register and log in
- create xweets
- reply to xweets
- follow and unfollow users
- like and unlike xweets
- view a personalized feed

This project was built as an MVP with a focus on clean backend structure, REST principles, relational persistence, and token-based authentication.

---

## Features

- User registration
- User authentication with JWT
- Password hashing with bcrypt
- Get user profile
- Create xweets
- Reply to xweets
- Follow and unfollow users
- Like and unlike xweets
- Personalized feed
- Health check endpoint

---

## Business Rules

- A user can create xweets
- A xweet belongs to exactly one user
- A xweet can have zero or many replies
- A user can follow other users
- A user cannot follow themselves
- A user can like any xweet, including their own
- A user can remove a like from a xweet
- A user’s feed includes:
  - their own xweets
  - xweets from users they follow

---

## Tech Stack

- **Node.js**
- **TypeScript**
- **Express.js**
- **PostgreSQL**
- **Prisma ORM**
- **JWT**
- **bcrypt**

---

## Project Structure

```bash
src/
  app.ts
  server.ts
  config/
  controllers/
  dtos/
  errors/
  middlewares/
  prisma/
  routes/
  services/
```

### Architecture

This project follows a layered backend structure:

- **routes**: define endpoints
- **controllers**: receive HTTP requests and return HTTP responses
- **services**: contain business logic and business rules
- **middlewares**: authentication, validation, and error handling
- **dtos**: shape returned data
- **prisma**: database access through Prisma Client

---

## API Base URL

Local:

```bash
http://localhost:3002
```

Production:

```bash
<your-render-url>
```

---

## Authentication

All routes require authentication except:

- `POST /auth/signup`
- `POST /auth/signin`

Authentication is JWT-based.

Send the token in the request header:

```http
Authorization: Bearer <your_token>
```

---

## Routes

### Public Routes

#### Register user
`POST /auth/signup`

#### Login user
`POST /auth/signin`

### Private Routes

#### Get user profile
`GET /users/:id`

#### Follow user
`POST /users/:id/follow`

#### Unfollow user
`DELETE /users/:id/follow`

#### Create xweet
`POST /xweets`

#### Reply to xweet
`POST /xweets/:id/reply`

#### Like xweet
`POST /xweets/:id/like`

#### Unlike xweet
`DELETE /xweets/:id/like`

#### Get personalized feed
`GET /feed`

### Health Check

#### API status
`GET /health`

---

## Example Requests

### 1. Register user

**Request**

```http
POST /auth/signup
Content-Type: application/json
```

**Body**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "birthdate": "2000-01-01"
}
```

**Example response**

```json
{
  "id": "generated-user-id",
  "name": "John Doe",
  "email": "john@example.com",
  "birthdate": "2000-01-01T00:00:00.000Z",
  "profileImage": "https://ui-avatars.com/api/?name=John%20Doe",
  "createdAt": "2026-04-22T12:00:00.000Z",
  "updatedAt": "2026-04-22T12:00:00.000Z"
}
```

### 2. Login user

**Request**

```http
POST /auth/signin
Content-Type: application/json
```

**Body**

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

**Example response**

```json
{
  "token": "<jwt-token>"
}
```

### 3. Create xweet

**Request**

```http
POST /xweets
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Body**

```json
{
  "content": "Hello world from X-uitter 🚀"
}
```

**Example response**

```json
{
  "id": "generated-xweet-id",
  "content": "Hello world from X-uitter 🚀",
  "createdAt": "2026-04-22T12:10:00.000Z",
  "authorId": "generated-user-id",
  "parentId": null
}
```

### 4. Reply to xweet

**Request**

```http
POST /xweets/:id/reply
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Body**

```json
{
  "content": "This is a reply"
}
```

**Example response**

```json
{
  "id": "generated-reply-id",
  "content": "This is a reply",
  "createdAt": "2026-04-22T12:20:00.000Z",
  "authorId": "generated-user-id",
  "parentId": "parent-xweet-id"
}
```

### 5. Get feed

**Request**

```http
GET /feed
Authorization: Bearer <jwt-token>
```

**Example response**

```json
[
  {
    "id": "xweet-id-1",
    "content": "My first xweet",
    "createdAt": "2026-04-22T12:00:00.000Z",
    "authorId": "user-id-1",
    "parentId": null,
    "author": {
      "id": "user-id-1",
      "name": "John Doe",
      "profileImage": "https://example.com/avatar.png"
    }
  }
]
```

### 6. Follow user

**Request**

```http
POST /users/:id/follow
Authorization: Bearer <jwt-token>
```

**Example response**

```json
{
  "message": "User followed successfully"
}
```

### 7. Unfollow user

**Request**

```http
DELETE /users/:id/follow
Authorization: Bearer <jwt-token>
```

**Example response**

```json
{
  "message": "User unfollowed successfully"
}
```

### 8. Like xweet

**Request**

```http
POST /xweets/:id/like
Authorization: Bearer <jwt-token>
```

**Example response**

```json
{
  "message": "Xweet liked"
}
```

### 9. Unlike xweet

**Request**

```http
DELETE /xweets/:id/like
Authorization: Bearer <jwt-token>
```

**Example response**

```json
{
  "message": "Like removed"
}
```

### 10. Get user profile

**Request**

```http
GET /users/:id
Authorization: Bearer <jwt-token>
```

**Example response**

```json
{
  "id": "user-id",
  "name": "John Doe",
  "email": "john@example.com",
  "profileImage": "https://example.com/avatar.png",
  "createdAt": "2026-04-22T12:00:00.000Z",
  "xweets": [
    {
      "id": "xweet-id",
      "content": "Hello world",
      "createdAt": "2026-04-22T12:10:00.000Z"
    }
  ],
  "followers": [],
  "following": []
}
```

---

## Environment Variables

Create a `.env` file in the project root.

Example:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>?schema=public"
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN="1d"
PORT=3002
```

---

## Installation and Setup

### 1. Clone the repository

```bash
git clone <your-public-repository-url>
cd <your-project-folder>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create your `.env` file based on the example above.

### 4. Run Prisma migrations

```bash
npx prisma migrate dev
```

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Start the development server

```bash
npm run dev
```

### 7. Access the API

```bash
http://localhost:3002
```

---

## Available Scripts

```bash
npm run dev
npm run build
npm start
npm test
```

> Update this section if your actual `package.json` scripts use different names.

---

## Health Check

Use the endpoint below to verify that the API is running:

```http
GET /health
```

**Example response**

```json
{
  "status": "ok"
}
```

---

## Error Handling

The API uses standard HTTP status codes.

Common examples:

- `200 OK`
- `201 Created`
- `400 Bad Request`
- `401 Unauthorized`
- `404 Not Found`
- `409 Conflict`
- `500 Internal Server Error`

Example error response:

```json
{
  "error": "Invalid credentials"
}
```

---

## Database

This project uses **PostgreSQL** with **Prisma ORM**.

Core domain entities:

- **User**
- **Xweet**
- **Follow**
- **Like**

Relationships include:

- a user has many xweets
- a xweet belongs to one user
- a xweet may reply to another xweet
- a user can follow many users
- a user can be followed by many users
- a user can like many xweets

---

## Notes About the Current Implementation

- Passwords are hashed with **bcrypt**
- Authentication is done with **JWT**
- `profileImage` is generated automatically from the user name in the current signup flow
- The feed is ordered by `createdAt` in descending order
- User profile responses include the user’s xweets, followers, and following list

---

## Deployment

This API is intended to be deployed on **Vercel**.

### Production checklist

- configure production environment variables
- connect the production PostgreSQL database
- run Prisma migrations
- generate Prisma Client
- set build and start commands correctly
- test all protected routes after deployment
- add the public repository link and deploy link to this README

Production URL:

```bash
https://x-witter-4-growdev.vercel.app/
```

---

## Testing

Example:

```bash
npm run test
```

testing scope:

- auth
- user profile
- xweet creation
- replies
- likes
- follows
- feed

- `.env.test`
- isolated test database
- `--runInBand`
- `NODE_OPTIONS=--experimental-vm-modules`

---

## Future Improvements

Possible next steps after the MVP:

- pagination for feed
- Swagger / OpenAPI documentation
- Docker support
- CI pipeline
- refresh token strategy
- stronger validation standardization
- higher automated test coverage

---

## Repository

GitHub:

```bash
https://github.com/jfan-dev/X-witter-4-growdev
```

---

## Author

**Jaime Fernandes**

- GitHub: [`https://github.com/jfan-dev`](https://github.com/jfan-dev)
- LinkedIn: [`www.linkedin.com/in/jfan-dev`](https://www.linkedin.com/in/jfan-dev)

---

## License

This project is for educational purposes.
