
import type { Metadata } from 'next';
import { OwnerSignupForm } from './owner-signup-form';

export const metadata: Metadata = {
  title: 'Owner Signup - Hobo Livings',
  description: 'Create a property owner account on Hobo Livings to start listing your hostels, PGs, or rooms.',
};

export default function OwnerSignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <OwnerSignupForm />
    </div>
  );
}
