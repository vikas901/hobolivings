
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginContent } from './login-content';

export const metadata: Metadata = {
  title: 'Login - Hobo Livings',
  description: 'Log in to your Hobo Livings account to manage your properties or find your next home.',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-secondary">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
