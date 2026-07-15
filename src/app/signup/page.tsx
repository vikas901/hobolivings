import type { Metadata } from 'next';
import { UserSignupForm } from './user/user-signup-form';

export const metadata: Metadata = {
  title: 'Sign Up - Hobo Livings',
  description: 'Create an account on Hobo Livings to find the best student hostels, PGs, and rooms in Delhi NCR.',
};

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <UserSignupForm />
    </div>
  );
}
