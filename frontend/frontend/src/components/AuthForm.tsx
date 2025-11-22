/**
 * File: src/components/AuthForm.tsx
 * Purpose: Minimal UI to login, hit protected routes, and force a refresh event.
 * Notes: Stores tokens in memory for MVP. Good enough to prove the flow.
 * Docs: App Router https://nextjs.org/docs/app
 */
'use client';

import { useState } from 'react';
import { api, setTokens } from '@/lib/axios';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [meta, setMeta] = useState<any>(null);
  const [log, setLog] =
    useState<string>('Ready.');

  async function register() {
    try {
      const res = await fetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email.split('@')[0],
          email,
          password,
        }),
      });
      const data = await res.json();
      setLog(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setLog(
        JSON.stringify(
          err?.response?.data || err.message,
          null,
          2
        )
      );
    }
  }

  async function login() {
    try {
      const res = await api.post('/auth/login', {
        email,
        password,
      });
      setTokens(
        res.data.accessToken,
        res.data.refreshToken
      );
      setMeta(res.data.meta);
      setLog('Logged in. Tokens set in memory.');
    } catch (err: any) {
      setLog(
        JSON.stringify(
          err?.response?.data || err.message,
          null,
          2
        )
      );
    }
  }

  async function hello() {
    try {
      const res = await api.get('/auth/hello');
      setLog(JSON.stringify(res.data, null, 2));
    } catch (err: any) {
      setLog(
        JSON.stringify(
          err?.response?.data || err.message,
          null,
          2
        )
      );
    }
  }

  async function me() {
    try {
      const res = await api.get('/auth/me');
      setLog(JSON.stringify(res.data, null, 2));
    } catch (err: any) {
      setLog(
        JSON.stringify(
          err?.response?.data || err.message,
          null,
          2
        )
      );
    }
  }

  function hint() {
    setLog(
      'Tip: wait 60-70s after login, then click Hello. 401 triggers refresh and replay.'
    );
  }

  return (
    <div className='max-w-md space-y-4'>
      <div className='space-y-2'>
        <label className='block text-sm'>
          Email
        </label>
        <input
          className='w-full border p-2 rounded'
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          placeholder='test@example.com'
        />
        <label className='block text-sm'>
          Password
        </label>
        <input
          className='w-full border p-2 rounded'
          type='password'
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          placeholder='supersecret'
        />
      </div>

      <div className='flex gap-2 flex-wrap'>
        <button
          className='border px-3 py-2 rounded'
          onClick={register}
        >
          Register
        </button>
        <button
          className='border px-3 py-2 rounded'
          onClick={login}
        >
          Login
        </button>
        <button
          className='border px-3 py-2 rounded'
          onClick={hello}
        >
          GET /auth/hello
        </button>
        <button
          className='border px-3 py-2 rounded'
          onClick={me}
        >
          GET /auth/me
        </button>
        <button
          className='border px-3 py-2 rounded'
          onClick={hint}
        >
          How to test
        </button>
      </div>

      {meta && (
        <details className='bg-gray-50 p-2 rounded'>
          <summary className='cursor-pointer'>
            Token meta
          </summary>
          <pre className='text-xs'>
            {JSON.stringify(meta, null, 2)}
          </pre>
        </details>
      )}

      <pre className='bg-gray-100 p-2 rounded text-xs min-h-24 whitespace-pre-wrap'>
        {log}
      </pre>
    </div>
  );
}
