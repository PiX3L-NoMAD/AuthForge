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

### Next Steps

* Step 3: Add `/auth/me` route to retrieve current user info
* Step 4: Connect to DynamoDB for extended identity management

---
