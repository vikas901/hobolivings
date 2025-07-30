'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image, { type StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { LogOut, User, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import logo from '@/assets/logo.png';

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    // This effect can be used to track user status for debugging if needed
    console.log('Header auth state changed. User:', user ? user.uid : 'logged out');
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Success', description: 'Logged out successfully!' });
      router.push('/');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: error.message,
      });
    }
  };

  const getAvatarFallback = () => {
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return <User className="h-4 w-4" />;
  };

  const Logo = () => {
    if (logoError) {
      console.error('Header: Failed to load logo, rendering fallback.');
      return (
        <div className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg font-headline text-primary">Hobo Livings</span>
        </div>
      );
    }
    return (
       <Image
        src={logo}
        alt="Hobo Livings Logo"
        width={140}
        height={40}
        priority
        onError={() => {
          console.warn('Header: Error loading logo.png. Setting fallback.');
          setLogoError(true);
        }}
        onLoad={() => {
          console.log('Header: logo.png loaded successfully.');
        }}
      />
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Logo />
        </Link>
        <div className="flex-1"></div>
        <nav className="flex items-center space-x-2 sm:space-x-4">
          <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => router.push('/list-your-property')}>
              List your property
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                     <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User Avatar'} />
                     <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName || 'My Account'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => router.push('/login')}>Login / Sign Up</Button>
          )}
        </nav>
      </div>
    </header>
  );
}

    