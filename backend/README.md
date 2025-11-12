<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# AuthForge 🛠️

A mock developer platform for managing user identities across games and apps.  
This is a portfolio project in active development.

---

## MVP Goal
- Register and log in users with JWT authentication  
- Store user data (username, email, createdAt) in **PostgreSQL**  
- Add token expiry + refresh  
- Protected route that says “Hello, [username]”  
- Optional AWS S3 integration later  
- Backend: **NestJS (TypeScript)**  
- Hosting: Render (backend) + Vercel (frontend)

---

## Step 1 — Project Setup (Completed ✅)

### What was done
- Created base NestJS app (`nest new backend`)
- Installed dependencies:
  - `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`
  - `@nestjs/typeorm`, `pg`, `bcrypt`
  - `@aws-sdk/client-dynamodb`, `@aws-sdk/lib-dynamodb`, `aws-sdk` (initial AWS setup)
- Verified app runs locally (`npm run start:dev`)
- Initialized Git and pushed first commit to GitHub

### Commands used
```bash
mkdir AuthForge && cd AuthForge
git init
nest new backend
cd backend
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install @nestjs/typeorm pg bcrypt
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb aws-sdk
git add .
git commit -m "Initial NestJS project setup"
git branch -M main
git push -u origin main
```

## Step 2 — Register & Login Flow (Completed ✅)

### What was done
This step established the authentication foundation of AuthForge.
It includes user registration, login, JWT-based authentication, refresh tokens, and a protected test route.

### Endpoints

| Method | Route            | Description                                  | Auth Required      |
| :----: | :--------------- | :------------------------------------------- | :----------------- |
| `POST` | `/auth/register` | Register a new user                          | No                 |
| `POST` | `/auth/login`    | Login user and receive tokens                | No                 |
|  `GET` | `/auth/hello`    | Protected test route                         | Yes (access token) |
| `POST` | `/auth/refresh`  | Generate new access token from refresh token | No                 |

### Stack
- NestJS — backend framework

- DynamoDB — database

- JWT (Passport) — authentication strategy

- Bcrypt — password hashing

- Insomnia — API testing

### How to Test in Insomnia

1. Start your backend:

   ```bash
   npm run start:dev
   ```
2. Test endpoints in order:

   **Register**

   ```json
   POST /auth/register
   {
     "username": "janilee",
     "email": "janilee@example.com",
     "password": "yourpassword"
   }
   ```

   **Login**

   ```json
   POST /auth/login
   {
     "email": "janilee@example.com",
     "password": "yourpassword"
   }
   ```

   * Copy the `accessToken` and `refreshToken` from the response.

   **Hello**

   ```json
   GET /auth/hello
   Headers:
   Authorization: Bearer <accessToken>
   ```

   **Refresh**

   ```json
   POST /auth/refresh
   {
     "refreshToken": "<refreshToken>"
   }
   ```

---

### Expected Behavior

* Registration creates a user in DynamoDB (passwords are hashed).
* Login returns both access and refresh tokens.
* `/auth/hello` only works with a valid access token.
* `/auth/refresh` issues a new access token when a valid refresh token is provided.

---

### Issues Encountered & Solutions

**1. Endpoint Authorization (401 errors)**
Early testing returned `Unauthorized` for protected routes.
*Fix:* Checked JWT strategy and guard configuration — confirmed correct payload structure and secrets. Once fixed, `/auth/hello` validated successfully.

**2. Refresh Token Errors**
The `/refresh` route initially failed token validation.
*Fix:* Matched refresh secret and expiry variables in environment config. Re-tested after login — refresh flow now works.

**3. AWS CLI Setup Confusion**
Had to install AWS CLI v2 manually since Ubuntu defaulted to v1 via Snap.
*Fix:* Removed old version, installed via `sudo apt install awscli`, configured credentials, and verified with `aws sts get-caller-identity`.

---

### Verification

All endpoints tested successfully in **Insomnia**:

✅ Register

✅ Login

✅ Access-protected route

✅ Refresh token

---

## Step 3 — `/auth/me` endpoint

**What it does**  
Returns the logged-in user’s profile from DynamoDB using the JWT in the `Authorization: Bearer <token>` header.

**Why it exists**  
Clients need a quick way to fetch “Who am I” after login without storing user data on the front end.

### Routes

- `GET /auth/me`  
  Requires a valid **access token**.

**Success 200**
```json
{
  "id": "uuid",
  "username": "janilee",
  "email": "you@example.com",
  "createdAt": "2025-11-07T18:22:31.000Z"
}
````

**Unauthorized 401**

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### Quick start

1. Log in to get an access token:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"password123"}'
```

2. Call `/auth/me` with the access token:

```bash
curl http://localhost:3000/auth/me \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Testing in Insomnia

* Create request: `GET http://localhost:3000/auth/me`
* Auth tab → Bearer → paste access token
* Try again after token expiry to confirm 401

### Security notes

* Protected by `JwtAuthGuard`
* Never returns `passwordHash` or `refreshTokenHash`
* Source of truth is DynamoDB, not the token body

### Data model

* Table name: `process.env.DYNAMODB_TABLE_USERS`
* Primary key used here: `pk = user#<id>`
* GSI for login flows: `email-index` on `email`

### Environment

```
JWT_ACCESS_SECRET=...
ACCESS_TOKEN_EXPIRES_IN=90s
JWT_REFRESH_SECRET=...
REFRESH_TOKEN_EXPIRES_IN=7d
AWS_REGION=...
DYNAMODB_TABLE_USERS=AuthForgeUsers
```

### Code map

* Guard: `src/auth/jwt-auth.guard.ts`
* Strategy attaches `request.user`: `src/auth/jwt.strategy.ts`
* Decorator: `src/auth/decorators/current-user.decorator.ts`
* Controller route: `src/auth/auth.controller.ts`
* DB calls: `src/users/users.service.ts`

### Troubleshooting

* 401 with a fresh token
  Check `JWT_ACCESS_SECRET` in both `JwtModule` and `JwtStrategy`.
* 200 but missing fields
  Verify the item written at `pk=user#<id>`.
* Still stuck
  Compare `JwtStrategy.validate()` return keys with your `JwtPayload` type.

### Changelog

* `feat(auth): add protected GET /auth/me`
* `chore(auth): define JwtPayload type`
* `test(auth): add Insomnia request for /auth/me`

### References

* Nest Guards: [https://docs.nestjs.com/guards](https://docs.nestjs.com/guards)
* Nest JWT: [https://docs.nestjs.com/security/authentication#jwt-functionality](https://docs.nestjs.com/security/authentication#jwt-functionality)
* AWS lib-dynamodb: [https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_lib_dynamodb.html](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_lib_dynamodb.html)


### Next Steps

* Step 4: Connect to DynamoDB for extended identity management

---