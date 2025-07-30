
'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import logo from '@/assets/logo.png';
import { Loader2 } from 'lucide-react';

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
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Success', description: 'Logged in successfully!' });
      if (role === 'owner') {
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
                <Image src={logo} alt="Hobo Livings Logo" width={140} height={40} priority />
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
