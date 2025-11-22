/**
 * File: src/app/page.tsx
 * Purpose: Landing page that hosts AuthForm.
 */
import AuthForm from '@/components/AuthForm';

export default function Home() {
  return (
    <main className='p-6'>
      <h1 className='text-2xl mb-2'>
        AuthForge Frontend
      </h1>
      <p className='mb-4 text-sm'>
        Log in, let the access token expire, then
        call a protected route to watch
        auto-refresh.
      </p>
      <AuthForm />
    </main>
  );
}
