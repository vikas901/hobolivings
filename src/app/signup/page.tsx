'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Rocket, Loader2 } from 'lucide-react';
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
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    profileType: 'student',
    preferredCity: '',
    agreedToTerms: false
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const router = useRouter();
  const { toast } = useToast();

  // Update form data
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8 || !/\d/.test(formData.password) || !/[a-zA-Z]/.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with letters and numbers';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreedToTerms) {
      newErrors.terms = 'You must agree to the Terms & Conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      console.log('Starting Google sign-in...');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log('Google sign-in successful, checking user document...');
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        console.log('Creating new user document...');
        await setDoc(userDocRef, {
          uid: user.uid,
          name: user.displayName || 'Google User',
          email: user.email,
          profileType: 'student',
          createdAt: new Date().toISOString(),
        });
      }

      console.log('Google sign-in complete, showing success message...');
      toast({ 
        title: '🎉 Welcome to Hobo Livings!', 
        description: 'You have been signed in successfully.' 
      });

      // Navigate to home page after a delay
      setTimeout(() => {
        console.log('Navigating to home page...');
        router.push('/');
      }, 2000);

    } catch (error: any) {
      console.error('Google sign-in error:', error);
      toast({
        variant: 'destructive',
        title: 'Google Sign-In Failed',
        description: error.message || 'An error occurred during Google sign-in',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle regular signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({ 
        variant: 'destructive', 
        title: 'Please fix the errors', 
        description: 'Check the form for validation errors' 
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Starting signup process...');

      // Check if mobile number already exists (if provided)
      if (formData.mobile.trim()) {
        console.log('Checking mobile number availability...');
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("mobile", "==", formData.mobile.trim()));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          toast({ 
            variant: 'destructive', 
            title: 'Mobile Number Taken', 
            description: 'This mobile number is already registered' 
          });
          setLoading(false);
          return;
        }
      }

      console.log('Creating user account...');
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email.trim(), 
        formData.password
      );
      const user = userCredential.user;

      console.log('Saving user data to Firestore...');
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim() || null,
        profileType: formData.profileType,
        preferredCity: formData.preferredCity || null,
        createdAt: new Date().toISOString(),
      });

      console.log('Account created successfully!');
      toast({ 
        title: '🎉 Account Created Successfully!', 
        description: 'Welcome to Hobo Livings! Please login to continue.' 
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        profileType: 'student',
        preferredCity: '',
        agreedToTerms: false
      });

      // Navigate to login page after delay
      setTimeout(() => {
        console.log('Navigating to login page...');
        navigateToLogin();
      }, 2500);

    } catch (error: any) {
      console.error('Signup error:', error);
      let errorMessage = error.message;
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please login instead.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use a stronger password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      }
      
      toast({ 
        variant: 'destructive', 
        title: 'Signup Failed', 
        description: errorMessage 
      });
    } finally {
      setLoading(false);
    }
  };

  // Safe navigation function
  const navigateToLogin = () => {
    try {
      router.push('/login');
    } catch (error) {
      console.error('Router navigation failed, using window.location:', error);
      window.location.href = '/login';
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 md:p-8">
      {/* Header */}
      <div className="absolute top-4 left-4">
        <Link href="/" className="flex items-center space-x-2 text-primary hover:underline">
          <Image src="/logo.png" alt="Hobo Livings Logo" width={140} height={40} />
        </Link>
      </div>

      <Card className="w-full max-w-2xl bg-secondary/50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl font-headline">
            Hobo Livings – Sign Up Form
          </CardTitle>
          <CardDescription>
            Find your perfect PG, Hostel, or Room in just a few clicks!
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Google Sign-up Button */}
          <div className="mb-6">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleGoogleSignIn} 
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <GoogleIcon className="mr-2 h-5 w-5" />
              )}
              Sign up with Google
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <Separator className="flex-1" />
            <span className="px-4 text-sm text-muted-foreground">OR SIGN UP WITH EMAIL</span>
            <Separator className="flex-1" />
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-6">
            
            {/* Basic Information */}
            <div>
              <p className="font-semibold text-primary mb-4">🔻 Basic Information</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div className="grid gap-2">
                  <Label htmlFor="name">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input 
                    id="name" 
                    placeholder="e.g., Rahul Sharma" 
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    disabled={loading}
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email">
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="e.g., rahul@example.com" 
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    disabled={loading}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                {/* Mobile */}
                <div className="grid gap-2">
                  <Label htmlFor="mobile">Phone Number (Optional)</Label>
                  <Input 
                    id="mobile" 
                    type="tel" 
                    placeholder="e.g., 9876543210" 
                    value={formData.mobile}
                    onChange={(e) => updateFormData('mobile', e.target.value)}
                    disabled={loading}
                  />
                </div>

                {/* Password */}
                <div className="grid gap-2">
                  <Label htmlFor="password">
                    Password <span className="text-destructive">*</span>
                  </Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    disabled={loading}
                    className={errors.password ? 'border-destructive' : ''}
                  />
                  <p className="text-xs text-muted-foreground">
                    Min 8 characters, with letters and numbers.
                  </p>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="grid gap-2 md:col-span-2">
                  <Label htmlFor="confirm-password">
                    Confirm Password <span className="text-destructive">*</span>
                  </Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                    disabled={loading}
                    className={errors.confirmPassword ? 'border-destructive' : ''}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Profile Type */}
            <div>
              <p className="font-semibold text-primary mb-4">🎓 Profile Type</p>
              <RadioGroup 
                value={formData.profileType} 
                onValueChange={(value) => updateFormData('profileType', value)}
                className="flex flex-col md:flex-row gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="type-student" />
                  <Label htmlFor="type-student">Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="professional" id="type-professional" />
                  <Label htmlFor="type-professional">Working Professional</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="type-other" />
                  <Label htmlFor="type-other">Other</Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            {/* Preferred City */}
            <div>
              <Label htmlFor="city-select" className="font-semibold text-primary">
                🏙️ Preferred City (Optional)
              </Label>
              <Select 
                value={formData.preferredCity} 
                onValueChange={(value) => updateFormData('preferredCity', value)}
              >
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

            <Separator />

            {/* Terms and Conditions */}
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={formData.agreedToTerms} 
                  onCheckedChange={(checked) => updateFormData('agreedToTerms', Boolean(checked))}
                />
                <Label htmlFor="terms" className="text-sm text-muted-foreground">
                  I agree to the{' '}
                  <Link href="#" className="underline text-primary">
                    Terms & Conditions
                  </Link>{' '}
                  and{' '}
                  <Link href="#" className="underline text-primary">
                    Privacy Policy
                  </Link>
                  .
                </Label>
              </div>
              {errors.terms && (
                <p className="text-sm text-destructive ml-6">{errors.terms}</p>
              )}
            </div>
            
            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full font-headline text-lg" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <Rocket className="mr-2 h-5 w-5" />
                  Sign Up & Explore
                </>
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline font-semibold text-primary">
              Login Here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
