# X-uitter API

[🇧🇷 Versão em Português](./README.pt-BR.md)

## 🌐 Description

**X-uitter API** is a Twitter/X-inspired REST API built as an MVP project that allows users to register, log in, publish xweets, reply to posts, like content, follow other users, and view a personalized feed.

The application was built with a simple monolithic architecture, organized into **routes**, **controllers**, **services**, **middlewares**, and relational database integration using **PostgreSQL** and **Prisma ORM**.

The main goal of the project is to demonstrate the development of a functional backend API with authentication, data persistence, business rules, and deployment in a public environment.

![API Backend]
<p align="center">
  <img src="./docs/assets/x-uitter-banner.png" alt="X-uitter banner" width="800" />
</p>

## 🌐 Prerequisites to run the project

- Backend: **Node.js + TypeScript + Express.js**
- Database: **PostgreSQL**
- ORM: **Prisma ORM**
- Authentication: **JWT + bcrypt**
- Package manager: **npm**
- Recommended environment: **Ubuntu 22.04 or higher**

### Cloning the repository

```bash
> git clone https://github.com/jfan-dev/X-witter-4-growdev.git
> cd X-witter-4-growdev
```

### Configuring environment variables

Create a `.env` file in the project root:

```bash
> touch .env
```

Configuration example:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your_secret_key"
JWT_EXPIRES_IN="1d"
PORT=3002
```

> Never commit the `.env` file to GitHub. Keep only a versioned `.env.example` file.

### Installing dependencies

```bash
> npm install
```

### Configuring Prisma

```bash
# Generate the Prisma Client
> npx prisma generate

# Run database migrations
> npx prisma migrate dev
```

### Running the Backend

```bash
# Start the development server
> npm run dev
```

The API will be available at:

```bash
http://localhost:3002
```

To check if the server is running:

```bash
GET http://localhost:3002/health
```

Expected response:

```json
{
  "status": "ok"
}
```

### Running with Docker

> Use this option if you want to run the API and PostgreSQL database in containers without depending on a local PostgreSQL installation.

#### Docker prerequisites

- Docker installed
- Docker Compose installed
- `.env` file configured in the project root

Example `.env` for Docker Compose:

```env
DATABASE_URL="postgresql://postgres:postgres@db:5432/xuitter?schema=public"
JWT_SECRET="your_secret_key"
JWT_EXPIRES_IN="1d"
PORT=3002
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="postgres"
POSTGRES_DB="xuitter"
```

> In Docker Compose, the database host should usually be the PostgreSQL service name, for example `db`, instead of `localhost`.

#### Starting the application

```bash
# Build the images and start the containers
> docker compose up --build
```

The API will be available at:

```bash
http://localhost:3002
```

To run it in the background:

```bash
> docker compose up --build -d
```

#### Running migrations inside the container

After the database is running, execute the Prisma migrations:

```bash
> docker compose exec api npx prisma migrate dev
```

If the API service has another name in `docker-compose.yml`, replace `api` with the correct service name.

You can also regenerate the Prisma Client inside the container:

```bash
> docker compose exec api npx prisma generate
```

#### Checking if the API is working

```bash
> curl http://localhost:3002/health
```

Expected response:

```json
{
  "status": "ok"
}
```

#### Useful Docker commands

```bash
# View container logs
> docker compose logs -f

# View only API logs
> docker compose logs -f api

# Stop the containers
> docker compose down

# Stop the containers and remove database volumes
> docker compose down -v

# Access the API container shell
> docker compose exec api sh
```

> Use `docker compose down -v` carefully because it removes the PostgreSQL volume and deletes the local database data used by the containers.

### Running tests

```bash
> npm run test
```

If the project is using Jest with TypeScript in ESM mode, the command may need to run with:

```bash
> NODE_OPTIONS="--experimental-vm-modules" npx jest --runInBand
```

#### ✍🏻️ Additional Features

| 🔐 JWT Authentication | 🐦 Xweets and replies | 📰 Personalized feed |
| --- | --- | --- |
| Secure login with encrypted passwords using bcrypt and JWT generation. | Authenticated users can create posts and reply to other posts. | The feed returns the user's own xweets and xweets from followed users. |

| ❤️ Likes | 🤝 Follow system | 🛡️ Validations and errors |
| --- | --- | --- |
| Users can like and remove likes from xweets, including their own. | Users can follow and unfollow other users, except themselves. | Authentication middleware, input validation, and centralized error handling. |

#### ✍🏻️ Resources and Technologies Used

| Technology | Usage | Website |
|---|---|---|
| Node.js | JavaScript runtime environment for the backend | [Link](https://nodejs.org/) |
| TypeScript | Static typing for safer and clearer code | [Link](https://www.typescriptlang.org/) |
| Express.js | Framework for building the REST API | [Link](https://expressjs.com/) |
| PostgreSQL | Relational database used for persistence | [Link](https://www.postgresql.org/) |
| Prisma ORM | ORM for modeling, migrations, and database access | [Link](https://www.prisma.io/) |
| JWT | Token-based authentication | [Link](https://jwt.io/) |
| bcrypt | Password hashing | [Link](https://www.npmjs.com/package/bcrypt) |
| Jest | Automated testing | [Link](https://jestjs.io/) |
| Supertest | Integration testing for HTTP endpoints | [Link](https://www.npmjs.com/package/supertest) |
| Vercel | API deployment | [Link](https://vercel.com/) |
| GitHub | Version control and public repository hosting | [Link](https://github.com/) |

## 📌 Main Entities

| Entity | Responsibility |
|---|---|
| User | Represents an application user, including login data, profile data, and social relationships. |
| Xweet | Represents a post created by a user. It can also be a reply. |
| Like | Represents a user's like on a xweet. |
| Follow | Represents the relationship between a follower user and a followed user. |
| Session | Represents valid authentication sessions, if the project uses database-based session control. |

## 📘 API Documentation with Swagger

After starting the server, access the interactive API documentation with Swagger.

Local environment:

```bash
http://localhost:3002/docs
```

Production/deployment environment:

```bash
https://https://x-witter-4-growdev-9jsfwcxis-jfan-test.vercel.app//docs
```

With Swagger, you can:

- View all available API routes
- Check request body examples
- Test endpoints directly from the browser
- Add the JWT token to access protected routes

### Authenticating in Swagger

1. Open the local documentation or the deployed documentation URL
2. Create a user using `POST /auth/signup`, if you do not already have one
3. Log in using `POST /auth/signin`
4. Copy the JWT token returned by the API
5. Click the **Authorize** button in Swagger
6. Enter the token using the following format:

```bash
Bearer YOUR_TOKEN_HERE
```

After that, protected routes such as `/xweets`, `/feed`, `/users/:id/follow`, and `/xweets/:id/like` can be tested directly from Swagger in the local environment or in the deployed API.

> If the documentation endpoint is different in the project, update `/docs` according to the Express configuration.

## 🔗 API Routes

> All routes require Bearer Token authentication, except registration and login.

### Authentication

| Method | Route | Description | Authentication |
|---|---|---|---|
| POST | `/auth/signup` | Registers a new user | No |
| POST | `/auth/signin` | Logs in and returns a JWT token | No |

### Users

| Method | Route | Description | Authentication |
|---|---|---|---|
| GET | `/users/:id` | Returns profile, xweets, followers, and following users | Yes |
| POST | `/users/:id/follow` | Follows a user | Yes |
| DELETE | `/users/:id/follow` | Unfollows a user | Yes |

### Xweets

| Method | Route | Description | Authentication |
|---|---|---|---|
| POST | `/xweets` | Creates a new xweet | Yes |
| POST | `/xweets/:id/reply` | Creates a reply to a xweet | Yes |
| POST | `/xweets/:id/like` | Likes a xweet | Yes |
| DELETE | `/xweets/:id/like` | Removes a like from a xweet | Yes |

### Feed

| Method | Route | Description | Authentication |
|---|---|---|---|
| GET | `/feed` | Returns the user's own xweets and xweets from followed users | Yes |

## 🧪 Request Examples

### Create user

```bash
curl -X POST http://localhost:3002/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jaime Fernandes",
    "email": "jaime@example.com",
    "password": "Password@123",
    "birthdate": "1995-01-01"
  }'
```

### Log in

```bash
curl -X POST http://localhost:3002/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jaime@example.com",
    "password": "Password@123"
  }'
```

### Create xweet

```bash
curl -X POST http://localhost:3002/xweets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "content": "My first xweet 🚀"
  }'
```

### Get feed

```bash
curl -X GET http://localhost:3002/feed \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🛠 Challenges and Solutions

### Jest configuration with TypeScript and ESM

- During test setup, Jest needed adjustments to work correctly with TypeScript in ESM mode.
- The solution was to run tests with `NODE_OPTIONS="--experimental-vm-modules"` and configure `jest.config.ts` to map `.js` imports to TypeScript files during tests.

### Running tests sequentially

- Some tests failed when executed in parallel because they shared database state.
- The solution was to use `--runInBand`, ensuring test files run one at a time.

### Prisma Client compatibility

- During development, there were synchronization issues between Prisma Client and the remote database.
- The solution was to keep a Prisma Client version compatible with the environment used in the project.

### JWT typing with TypeScript

- The `jsonwebtoken` typing required care with the `expiresIn` field, especially with `exactOptionalPropertyTypes` enabled in TypeScript.
- The solution was to ensure the options passed to `jwt.sign` were compatible with the types expected by the library.

### Authentication control in private routes

- The API requires all private routes to validate the JWT token before accessing controllers.
- The solution was to create a reusable authentication middleware and apply it to users, xweets, likes, follows, and feed routes.

## 🚀 Deployment

The API should be published on a platform such as Render or Vercel.

### Deployment checklist

- [ ] Create a production PostgreSQL database
- [ ] Configure `DATABASE_URL`
- [ ] Configure `JWT_SECRET`
- [ ] Configure `JWT_EXPIRES_IN`
- [ ] Run production migrations
- [ ] Configure the build command
- [ ] Configure the start command
- [ ] Validate the `/health` route
- [ ] Add the deployment link to the README

### Project links

| Resource | Link |
|---|---|
| Repository | [GitHub](https://github.com/jfan-dev/X-witter-4-growdev) |
| Deployment | [Vercel](https://x-witter-4-growdev-9jsfwcxis-jfan-test.vercel.app) |

## ✅ MVP Status

| Feature | Status |
|---|---|
| User registration | ✅ Implemented |
| JWT login | ✅ Implemented |
| Authentication middleware | ✅ Implemented |
| Create xweet | ✅ Implemented |
| Create reply | ✅ Implemented |
| Like xweet | ✅ Implemented |
| Remove like | ✅ Implemented |
| Follow user | ✅ Implemented |
| Unfollow user | ✅ Implemented |
| Personalized feed | ✅ Implemented |
| Deployment | ✅ Implemented |

## 🐼 Developed by

**Jaime Fernandes**  
📧 jfernan10@gmail.com  
🔗 [LinkedIn](https://www.linkedin.com/in/jfan-dev)  
🐙 [GitHub](https://github.com/jfan-dev)
