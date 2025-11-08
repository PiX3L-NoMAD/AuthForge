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

A mock developer platform for managing user identities across games and apps. This is a portfolio project that's still in the early development phase.

---

## MVP Goal
- Register and log in users with JWT authentication
- Store user data (username, email, createdAt) in DynamoDB
- Add token expiry + refresh
- Simple route or UI that says “Hello, [username]”
- Optional AWS S3 integration later
- Backend: NestJS (TypeScript)
- Hosting: Render (backend) + Vercel (frontend)

---

## Step 1 — Project Setup (Completed ✅)

### What was done
- Created base NestJS app (`nest new backend`)
- Installed dependencies:
  - `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`
  - `@aws-sdk/client-dynamodb`, `@aws-sdk/lib-dynamodb`
  - `aws-sdk`
- Verified the app runs locally (`npm run start:dev`)
- Initialized Git and pushed first commit to GitHub

### Commands used
```bash
mkdir AuthForge && cd AuthForge
git init
nest new backend
cd backend
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb aws-sdk
git add .
git commit -m "Initial NestJS project setup"
git branch -M main
git push -u origin main
```

## Next Steps
- Add user registration route

- Store user info in DynamoDB

- Add login + JWT issue

- Token expiry + refresh

- Optional simple frontend test

---