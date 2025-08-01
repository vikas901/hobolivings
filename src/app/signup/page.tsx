
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, User } from 'lucide-react';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-secondary">
      <div className="text-center max-w-lg mx-4">
        <Link href="/" className="mb-8 inline-block">
            <Image src="/logo.png" alt="Hobo Livings Logo" width={180} height={50} />
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Join Hobo Livings</CardTitle>
            <CardDescription className="pt-2">
              What brings you to our platform today? Choose your path to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/signup/user">
              <Button variant="outline" className="w-full h-24 flex flex-col justify-center items-center gap-2">
                <User className="h-8 w-8 text-primary" />
                <span className="font-semibold">I want to find a property</span>
                <span className="text-xs text-muted-foreground">For Students & Professionals</span>
              </Button>
            </Link>
            <Link href="/signup/owner">
              <Button variant="outline" className="w-full h-24 flex flex-col justify-center items-center gap-2">
                <Home className="h-8 w-8 text-primary" />
                <span className="font-semibold">I want to list a property</span>
                 <span className="text-xs text-muted-foreground">For Property Owners</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary underline hover:text-primary/80">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
