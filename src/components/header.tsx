'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { LogOut, User, LayoutDashboard, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { doc, setDoc } from 'firebase/firestore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Header() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const hasLandlordRole = userProfile?.roles?.includes('landlord');
  const isOwner = userProfile?.activeRole === 'landlord';

  const handleSwitchRole = async () => {
    if (!user || !userProfile) return;
    try {
      const nextRole = isOwner ? 'tenant' : 'landlord';
      await setDoc(doc(db, 'users', user.uid), {
        activeRole: nextRole
      }, { merge: true });
      
      toast({
        title: 'Role Switched',
        description: `Switched to ${nextRole === 'landlord' ? 'Host' : 'Guest'} Mode successfully!`,
      });

      if (nextRole === 'landlord') {
        router.push('/owner/dashboard');
      } else {
        router.push('/');
      }
    } catch (e: any) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Switch Failed',
        description: e.message,
      });
    }
  };

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
    if (userProfile?.name) {
      return userProfile.name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return <User className="h-4 w-4" />;
  };

  // Guest sees "List Property", Host sees "List Property". 
  // Tenant (without host role) sees "Become a Host".
  // Tenant (with host role, in guest mode) sees "Switch to Host Mode".
  const showBecomeHost = user && !hasLandlordRole;
  const showSwitchToHost = user && hasLandlordRole && !isOwner;
  const showListProperty = !user || isOwner;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2 shrink-0">
           <Image src="/logo.png" alt="Hobo Livings Logo" width={120} height={35} />
        </Link>
        <nav className="hidden lg:flex items-center space-x-6 text-sm font-semibold text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/about" className="hover:text-foreground transition-colors">
            About Us
          </Link>
          <Link href="/careers" className="hover:text-foreground transition-colors flex items-center gap-1.5">
            Careers
            <span className="bg-primary text-primary-foreground px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider leading-none">
              Hiring
            </span>
          </Link>
          <Link href="/faqs" className="hover:text-foreground transition-colors">
            FAQs
          </Link>
          <Link href="/contact" className="hover:text-foreground transition-colors">
            Contact Us
          </Link>
        </nav>
        <div className="flex-1"></div>
        <nav className="flex items-center space-x-2 sm:space-x-4">
          {showListProperty && (
            <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => router.push('/list-your-property')}>
                List your property
            </Button>
          )}

          {showBecomeHost && (
            <Button variant="outline" className="hidden sm:inline-flex" onClick={() => router.push('/become-landlord')}>
                Become a Host
            </Button>
          )}

          {showSwitchToHost && (
            <Button variant="ghost" className="hidden sm:inline-flex" onClick={handleSwitchRole}>
                <RefreshCw className="mr-1.5 h-4 w-4" />
                Switch to Host Mode
            </Button>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                     <AvatarImage src={user.photoURL || undefined} alt={userProfile?.name || 'User Avatar'} />
                     <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userProfile?.name || 'My Account'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isOwner && (
                  <DropdownMenuItem onClick={() => router.push('/owner/dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                )}
                {hasLandlordRole && (
                  <DropdownMenuItem onClick={handleSwitchRole}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    <span>Switch to {isOwner ? 'Guest Mode' : 'Host Mode'}</span>
                  </DropdownMenuItem>
                )}
                {(userProfile?.isAdmin || user?.email?.endsWith('@hobolivings.com')) && (
                  <DropdownMenuItem onClick={() => router.push('/admin')}>
                    <User className="mr-2 h-4 w-4 text-primary" />
                    <span className="font-semibold text-primary">Admin Panel</span>
                  </DropdownMenuItem>
                )}
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
