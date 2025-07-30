
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Home, Rocket } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 48 48" {...props}>
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.618-3.317-11.28-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.407 44 30.564 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
);

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileType, setProfileType] = useState('student');
  const [preferredCity, setPreferredCity] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            profileType: 'student',
        });
      }

      toast({ title: 'Welcome to Hobo Livings!', description: 'Your account has been created successfully.' });
      router.push('/');
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Google Sign-In Failed',
            description: error.message,
        });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({ variant: 'destructive', title: 'Signup Failed', description: 'Passwords do not match.' });
      return;
    }

    if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      toast({ variant: 'destructive', title: 'Signup Failed', description: 'Password must be at least 8 characters long and contain both letters and numbers.' });
      return;
    }
    
    if (!agreedToTerms) {
        toast({ variant: 'destructive', title: 'Signup Failed', description: 'You must agree to the Terms & Conditions and Privacy Policy.'});
        return;
    }

    setLoading(true);
    try {
      if (mobile) {
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("mobile", "==", mobile));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
              toast({ variant: 'destructive', title: 'Signup Failed', description: 'This mobile number is already in use.' });
              return;
          }
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        mobile,
        profileType,
        preferredCity,
      });

      toast({ 
        title: '🎉 Welcome to Hobo Livings!', 
        description: 'Your account has been created successfully.' 
      });
      router.push('/');
    } catch (error: any) {
      let errorMessage = error.message;
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email address is already in use. Please use a different email or log in.';
      }
      toast({ variant: 'destructive', title: 'Signup Failed', description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4 md:p-8">
      <div className="absolute top-4 left-4">
        <Link href="/" className="flex items-center space-x-2 text-primary hover:underline">
          <Home className="h-6 w-6" />
          <span className="font-bold font-headline text-lg">Hobo Livings</span>
        </Link>
      </div>
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl font-headline">Hobo Livings – Sign Up Form</CardTitle>
          <CardDescription>Find your perfect PG, Hostel, or Room in just a few clicks!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Button variant="outline" className="w-full md:col-span-3" onClick={handleGoogleSignIn} disabled={loading}>
                <GoogleIcon className="mr-2 h-5 w-5" />
                Sign up with Google
            </Button>
          </div>

          <div className="flex items-center my-4">
            <Separator className="flex-1" />
            <span className="px-4 text-sm text-muted-foreground">OR SIGN UP WITH EMAIL</span>
            <Separator className="flex-1" />
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            
            <p className="font-semibold text-primary">🔻 Basic Information</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                <Input id="name" placeholder="e.g., Rahul Sharma" required value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                <Input id="email" type="email" placeholder="e.g., rahul@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mobile">Phone Number (Optional)</Label>
                <Input id="mobile" type="tel" placeholder="e.g., 9876543210" value={mobile} onChange={(e) => setMobile(e.target.value)} disabled={loading} />
              </div>
               <div className="grid gap-2">
                 <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
                 <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading}/>
                 <p className="text-xs text-muted-foreground">Min 8 characters, with letters and numbers.</p>
               </div>
               <div className="grid gap-2 md:col-span-2">
                 <Label htmlFor="confirm-password">Confirm Password <span className="text-destructive">*</span></Label>
                 <Input id="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading}/>
               </div>
            </div>

            <Separator />
            <p className="font-semibold text-primary">🎓 Profile Type</p>
            <RadioGroup value={profileType} onValueChange={setProfileType} className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center space-x-2"><RadioGroupItem value="student" id="type-student" /><Label htmlFor="type-student">Student</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="professional" id="type-professional" /><Label htmlFor="type-professional">Working Professional</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="other" id="type-other" /><Label htmlFor="type-other">Other</Label></div>
            </RadioGroup>

            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                    <Label htmlFor="city-select" className="font-semibold text-primary">🏙️ Preferred City (Optional)</Label>
                    <Select value={preferredCity} onValueChange={setPreferredCity}>
                      <SelectTrigger id="city-select" className="w-full mt-2">
                        <SelectValue placeholder="Select your first choice city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Delhi">Delhi</SelectItem>
                        <SelectItem value="Noida">Noida</SelectItem>
                        <SelectItem value="Greater Noida">Greater Noida</SelectItem>
                        <SelectItem value="Gurugram">Gurugram</item>
                        <SelectItem value="Bangalore">Bangalore</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
            </div>

            <Separator />
            <div className="flex items-start space-x-2">
              <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={(checked) => setAgreedToTerms(Boolean(checked))} />
              <Label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the <Link href="#" className="underline text-primary">Terms & Conditions</Link> and <Link href="#" className="underline text-primary">Privacy Policy</Link>.
              </Label>
            </div>
            
            <Button type="submit" className="w-full font-headline text-lg" disabled={loading}>
              {loading ? 'Creating Account...' : (
                <>
                  <Rocket className="mr-2" />
                  Sign Up & Explore
                </>
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline font-semibold">
              Login Here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
