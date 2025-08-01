
import type { Metadata } from 'next';
import { UserSignupForm } from './user-signup-form';

export const metadata: Metadata = {
  title: 'User Signup - Hobo Livings',
  description: 'Create an account on Hobo Livings to find the best student hostels, PGs, and rooms.',
};

export default function UserSignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <UserSignupForm />
    </div>
  );
}
