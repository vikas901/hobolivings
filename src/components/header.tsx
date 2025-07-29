import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Home className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-lg text-primary">Hobo Livings</span>
        </Link>
        <div className="flex-1"></div>
        <nav className="flex items-center space-x-2">
          <Button variant="ghost">List your property</Button>
          <Button>Login / Sign Up</Button>
        </nav>
      </div>
    </header>
  );
}
