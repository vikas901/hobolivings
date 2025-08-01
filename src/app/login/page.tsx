
'use client';

import { Suspense } from 'react';
import type { Metadata } from 'next';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import logo from '@/assets/logo.png';

export const metadata: Metadata = {
  title: 'Login - Hobo Livings',
  description: 'Log in to your Hobo Livings account to manage your properties or find your next home.',
};

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        throw new Error("User profile not found. Please contact support.");
      }

      const userProfile = userDoc.data() as UserProfile;

      const isOwnerLoginFlow = role === 'owner';
      const isOwnerProfile = userProfile.profileType === 'owner';

      if (isOwnerProfile && !isOwnerLoginFlow) {
        await auth.signOut();
        toast({
          variant: 'destructive',
          title: 'Login Path Restricted',
          description: "This login is for students. Please use the 'List your property' page to log in as an owner.",
        });
        router.push('/list-your-property');
        return;
      }
      
      if (!isOwnerProfile && isOwnerLoginFlow) {
        await auth.signOut();
        toast({
          variant: 'destructive',
          title: 'Login Path Restricted',
          description: "This login is for property owners. Please use the main login page.",
        });
        router.push('/login');
        return;
      }

      toast({ title: 'Success', description: 'Logged in successfully!' });
      if (isOwnerLoginFlow) {
        router.push('/list-your-property');
      } else {
        router.push('/');
      }

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const signupLink = role === 'owner' ? '/signup/owner' : '/signup/user';
  const signupText = role === 'owner' ? 'Sign up as an Owner' : 'Sign up';
  const loginTitle = role === 'owner' ? 'Owner Login' : 'Welcome Back';
  const loginDescription = role === 'owner' ? 'Login to list and manage your properties.' : 'Login to access your account.';


  return (
      <Card className="w-full max-w-sm mx-4">
        <CardHeader className="text-center">
            <Link href="/" className="flex justify-center mb-4">
                 <Image src={logo} alt="Hobo Livings Logo" width={140} height={40} />
            </Link>
          <CardTitle className="text-2xl font-headline">{loginTitle}</CardTitle>
          <CardDescription>{loginDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href={signupLink} className="underline font-semibold text-primary">
              {signupText}
            </Link>
          </div>
        </CardContent>
      </Card>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-secondary">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
