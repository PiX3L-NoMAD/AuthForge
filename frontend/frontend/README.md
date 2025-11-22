# AuthForge Frontend

Tiny UI to talk to the API and prove the auth flow works.

## What exists right now
- Next.js app created with TypeScript and Tailwind
- Axios client with interceptors in place
- Minimal page with a form and test buttons
- Env file pointing to the backend

## Files added
```

frontend/
src/
app/
page.tsx          // landing page that renders the auth form
components/
AuthForm.tsx      // register, login, call protected routes
lib/
axios.ts          // axios client with auto refresh on 401
.env.local            // NEXT_PUBLIC_API_URL
package.json

```

## Environment
Create `frontend/.env.local`:
```

NEXT_PUBLIC_API_URL=[http://localhost:3000](http://localhost:3000)

````

## Run it
Backend running on port 3000
```bash
cd frontend
npm ci
npm run dev
````

If the port clashes with the API

```bash
PORT=3001 npm run dev
```

## How to click-test

1. Login with an existing user
2. Hit **GET /auth/hello** to see a 200
3. Wait a bit past the access token lifetime
4. Hit **GET /auth/hello** again to trigger auto refresh and retry

## Notes

* Tokens live in memory for now
* CORS is enabled in the backend
