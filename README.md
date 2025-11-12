# AuthForge

A tiny app for me to learn about a basic jwt auth flow. It's to learn and show how user accounts, tokens, and simple profiles work.

## What this is
- A mock app for user login flow
- Simple, testable flows to be able to demo live
- Short, readable code with explanatory comments (to deepen my own understanding)

## Current goal
**MVP**
- Register and log in with JWTs
- Store user data: username, email, createdAt
- Token expiry plus refresh
- A friendly “Hello, [username]” check
- Deploy it live

## Tech snapshot
- TypeScript
- NestJS for API
- DynamoDB for data
- JWT for auth flow
- Optional AWS S3 later
- Small frontend for now for manual testing with NextJS

## Repo layout
```

AuthForge/
backend/     API and auth logic
frontend/    Minimal UI for manual testing
README.md    You are here

```

## Status
- Step 1 setup complete
- Step 2 auth core complete
- Step 3 profile endpoint complete
- Step 4 token expiry and refresh in progress

## Roadmap
- Tiny UI to exercise login, hello, me
- Deploy API to Render
- Deploy UI to Vercel
- Add logout that revokes the stored refresh hash
- Later idea: S3 upload sample
- Later idea: KWS-style age check mock

## Security notes
- Never return password hashes
- Keep refresh tokens hashed at rest
- Keep secrets in env files, not in git

## Demo story
You sign up, you log in, your token ages out, the client refreshes, your request quietly retries, and you keep moving.

## Credits
Made by Janilee Svaerdstaal as a learning piece. No warranties. Use at your own risk.