## Getting Started

### 1. Prerequisites

- [Docker](https://www.docker.com/) — for running PostgreSQL
- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) — `npm install -g pnpm`

---

### 2. Environment variables

Create a `.env` file in `backend/` with the following variables:

```env
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=lisboa-registro
TYPEORM_SYNCHRONIZE=false
TYPEORM_LOGGING=false
PORT=3000

# JWT — change JWT_SECRET in production!
JWT_SECRET=change-me-in-production-use-a-long-random-string
JWT_EXPIRES_IN=8h
```

> The values above match the defaults in `docker-compose.yml`.

---

### 3. Start the database

From the **root** of the monorepo:

```bash
$ docker-compose up -d
```

This starts a PostgreSQL 17 container on port `5433`.

---

### 4. Install dependencies

```bash
$ pnpm install
```

---

### 5. Run migrations

```bash
$ pnpm run migration:run
```

To check the current migration status:

```bash
$ pnpm run migration:show
```

---

### 6. Seed initial data (roles & permissions)

```bash
$ pnpm run seed:roles-permissions
```

---

### 7. Start the server

```bash
# development (watch mode)
$ pnpm run start:dev

# production
$ pnpm run start:prod
```

---

## API Documentation (Swagger)

Once the server is running, Swagger UI is available at:

```
http://localhost:3000/api/docs
```

---

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
