'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Home, Rocket, Upload } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: 'Passwords do not match.',
      });
      setLoading(false);
      return;
    }

    if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: 'Password must be at least 8 characters long and contain both letters and numbers.',
      });
      setLoading(false);
      return;
    }
    
    if (!agreedToTerms) {
        toast({
            variant: 'destructive',
            title: 'Signup Failed',
            description: 'You must agree to the Terms & Conditions and Privacy Policy.',
        });
        setLoading(false);
        return;
    }

    try {
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

      toast({ title: 'Welcome to Hobo Livings!', description: 'Your account has been created successfully.' });
      router.push('/'); // Redirect to a welcome/dashboard page
    } catch (error: any) {
      let errorMessage = error.message;
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email address is already in use. Please use a different email or log in.';
      }
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: errorMessage,
      });
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
          <form onSubmit={handleSignup} className="space-y-6">
            
            <Separator />
            <p className="font-semibold text-primary">🔻 Basic Information</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                <Input id="name" placeholder="e.g., Rahul Sharma" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                <Input id="email" type="email" placeholder="e.g., rahul@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mobile">Phone Number <span className="text-destructive">*</span></Label>
                <Input id="mobile" type="tel" placeholder="OTP verification enabled" required value={mobile} onChange={(e) => setMobile(e.target.value)} />
              </div>
               <div className="grid gap-2">
                 <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
                 <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                 <p className="text-xs text-muted-foreground">Min 8 characters, with letters and numbers.</p>
               </div>
               <div className="grid gap-2">
                 <Label htmlFor="confirm-password">Confirm Password <span className="text-destructive">*</span></Label>
                 <Input id="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
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
                        <SelectItem value="Gurugram">Gurugram</SelectItem>
                        <SelectItem value="Bangalore">Bangalore</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
                 <div>
                    <Label className="font-semibold text-primary">📸 Upload ID Proof (Optional)</Label>
                    <Button type="button" variant="outline" className="w-full mt-2">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload (Aadhaar, College ID, etc.)
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">Speeds up verification for premium listings.</p>
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
