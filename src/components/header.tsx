'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { 
  LogOut, User, LayoutDashboard, RefreshCw, Menu, X, Home, Building2, 
  Briefcase, HelpCircle, Phone, MessageCircle, Plus, Sparkles, BookOpen 
} from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';

export default function Header() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const showBecomeHost = user && !hasLandlordRole;
  const showSwitchToHost = user && hasLandlordRole && !isOwner;
  const showListProperty = !user || isOwner;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <Image src="/logo.png" alt="Hobo Livings Logo" width={120} height={35} priority unoptimized />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-semibold text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/how-it-works" className="hover:text-foreground transition-colors text-primary font-bold">
              How It Works
            </Link>
            <Link href="/guides" className="hover:text-foreground transition-colors">
              Guides
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
        </div>

        {/* Right Desktop CTAs and Profile */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <nav className="hidden sm:flex items-center space-x-2 sm:space-x-3">
            {showListProperty && (
              <Button variant="ghost" size="sm" onClick={() => router.push('/list-your-property')}>
                List your property
              </Button>
            )}

            {showBecomeHost && (
              <Button variant="outline" size="sm" onClick={() => router.push('/become-landlord')}>
                Become a Host
              </Button>
            )}

            {showSwitchToHost && (
              <Button variant="ghost" size="sm" onClick={handleSwitchRole}>
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Switch to Host Mode
              </Button>
            )}
          </nav>

          {/* User Profile or Login */}
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
                    <p className="text-xs leading-none text-muted-foreground truncate">
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
            <Button size="sm" className="hidden sm:inline-flex" onClick={() => router.push('/login')}>
              Login / Sign Up
            </Button>
          )}

          {/* Mobile Hamburger Menu Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden h-9 w-9 p-0 text-foreground"
            aria-label="Toggle Mobile Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RESPONSIVE MOBILE NAVIGATION DRAWER                      */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b bg-background/98 backdrop-blur shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="container py-4 px-4 space-y-4">
            
            {/* Primary Navigation Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <Link 
                href="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-secondary bg-secondary/30 transition-colors"
              >
                <Home className="h-4 w-4 text-primary shrink-0" /> 
                <span>Home</span>
              </Link>

              <Link 
                href="/how-it-works" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-secondary bg-primary/10 text-primary font-bold transition-colors"
              >
                <Sparkles className="h-4 w-4 text-primary shrink-0" /> 
                <span>How It Works</span>
              </Link>

              <Link 
                href="/guides" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-secondary bg-secondary/30 transition-colors font-semibold"
              >
                <BookOpen className="h-4 w-4 text-primary shrink-0" /> 
                <span>Student Guides</span>
              </Link>
              
              <Link 
                href="/about" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-secondary bg-secondary/30 transition-colors"
              >
                <Building2 className="h-4 w-4 text-primary shrink-0" /> 
                <span>About Us</span>
              </Link>

              <Link 
                href="/careers" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-secondary bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary shrink-0" /> 
                  <span>Careers</span>
                </div>
                <span className="bg-primary text-primary-foreground px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase">
                  Hiring
                </span>
              </Link>

              <Link 
                href="/faqs" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-secondary bg-secondary/30 transition-colors"
              >
                <HelpCircle className="h-4 w-4 text-primary shrink-0" /> 
                <span>FAQs</span>
              </Link>

              <Link 
                href="/contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-secondary bg-secondary/30 transition-colors"
              >
                <Phone className="h-4 w-4 text-primary shrink-0" /> 
                <span>Contact Us</span>
              </Link>

              <a 
                href="https://wa.me/918920642742" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold transition-colors"
              >
                <MessageCircle className="h-4 w-4 shrink-0" /> 
                <span>WhatsApp</span>
              </a>
            </div>

            <Separator />

            {/* Role, Listing & Property Actions */}
            <div className="space-y-2">
              {showListProperty && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-xs font-semibold" 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push('/list-your-property');
                  }}
                >
                  <Plus className="h-4 w-4 mr-2 text-primary" /> List Your Property
                </Button>
              )}

              {showBecomeHost && (
                <Button 
                  variant="secondary" 
                  className="w-full justify-start text-xs font-semibold" 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push('/become-landlord');
                  }}
                >
                  <Home className="h-4 w-4 mr-2 text-primary" /> Become a Host
                </Button>
              )}

              {showSwitchToHost && (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-xs font-semibold" 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSwitchRole();
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" /> Switch to Host Mode
                </Button>
              )}

              {isOwner && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-xs font-semibold text-primary border-primary/30" 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push('/owner/dashboard');
                  }}
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" /> Landlord Dashboard
                </Button>
              )}

              {(userProfile?.isAdmin || user?.email?.endsWith('@hobolivings.com')) && (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-xs font-semibold text-primary bg-primary/10" 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push('/admin');
                  }}
                >
                  <User className="h-4 w-4 mr-2" /> Admin Panel
                </Button>
              )}

              {/* User Account / Login footer */}
              {user ? (
                <div className="pt-3 flex items-center justify-between border-t">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={user.photoURL || undefined} alt={userProfile?.name || 'Avatar'} />
                      <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                    </Avatar>
                    <div className="truncate text-left">
                      <p className="text-xs font-bold leading-tight truncate">{userProfile?.name || 'Student/Tenant'}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="text-xs h-8 px-3"
                  >
                    <LogOut className="h-3.5 w-3.5 mr-1" /> Logout
                  </Button>
                </div>
              ) : (
                <Button 
                  className="w-full font-semibold mt-1" 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push('/login');
                  }}
                >
                  Login / Sign Up
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
