
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Rocket } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/context/auth-context';
import { PasswordInput } from '@/components/ui/password-input';
import { PasswordStrength } from '@/components/ui/password-strength';
import logo from '@/assets/logo.png';

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export function UserSignupForm() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileType: 'student',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user && userProfile) {
      if (userProfile.activeRole === 'landlord') {
        router.push('/owner/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [user, userProfile, authLoading, router]);
  const { toast } = useToast();

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const criteria = {
        length: formData.password.length >= 8,
        uppercase: /[A-Z]/.test(formData.password),
        lowercase: /[a-z]/.test(formData.password),
        number: /[0-9]/.test(formData.password),
        specialChar: /[@$!%*?&]/.test(formData.password),
      }
      if (!Object.values(criteria).every(Boolean)) {
        newErrors.password = 'Password must meet all strength requirements';
      }
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email.trim(), formData.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: formData.name.trim(),
        email: formData.email.trim(),
        roles: ['tenant'],
        activeRole: 'tenant',
        tenantType: formData.profileType as 'student' | 'professional',
        profileType: formData.profileType as 'student' | 'professional',
        createdAt: new Date().toISOString(),
      });

      toast({ 
        title: '🎉 Welcome to Hobo Livings!', 
        description: 'Your account has been created successfully.' 
      });
      router.push('/');

    } catch (error: any) {
      if (auth.currentUser) {
        try {
          await auth.currentUser.delete();
        } catch (deleteError) {
          console.error("Failed to clean up authenticated user after profile creation failure:", deleteError);
        }
      }

      let errorMessage = 'An unknown error occurred.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please log in instead.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'The password is too weak.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast({ variant: 'destructive', title: 'Signup Failed', description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
     <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <Link href="/" className="flex justify-center mb-4">
                <Image src={logo} alt="Hobo Livings Logo" width={140} height={40} />
            </Link>
            <CardTitle className="font-headline text-2xl">Create Your Account</CardTitle>
            <CardDescription>Find your next home with us.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={formData.name} onChange={(e) => updateFormData('name', e.target.value)} disabled={loading || authLoading} className={errors.name ? 'border-destructive' : ''} />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => updateFormData('email', e.target.value)} disabled={loading || authLoading} className={errors.email ? 'border-destructive' : ''} />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput id="password" value={formData.password} onChange={(e) => updateFormData('password', e.target.value)} disabled={loading || authLoading} className={errors.password ? 'border-destructive' : ''} />
              <PasswordStrength password={formData.password} />
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <PasswordInput id="confirm-password" value={formData.confirmPassword} onChange={(e) => updateFormData('confirmPassword', e.target.value)} disabled={loading || authLoading} className={errors.confirmPassword ? 'border-destructive' : ''} />
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
            </div>
            
            <div>
              <Label className="font-semibold">I am a...</Label>
              <RadioGroup 
                value={formData.profileType} 
                onValueChange={(value) => updateFormData('profileType', value)}
                disabled={loading || authLoading}
                className="flex gap-4 pt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="type-student" />
                  <Label htmlFor="type-student">Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="professional" id="type-professional" />
                  <Label htmlFor="type-professional">Working Professional</Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full" disabled={loading || authLoading}>
              {(loading || authLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {authLoading ? 'Verifying Session...' : loading ? 'Creating Account...' : 'Create My Account'}
            </Button>
          </form>
          <div className="mt-4 flex flex-col gap-3 text-center text-sm">
            <div>
              Already have an account?{' '}
              <Link href="/login" className="underline font-semibold text-primary">
                Login
              </Link>
            </div>
            <div className="text-muted-foreground text-xs">or</div>
            <Link href="/login?authMode=otp&role=user">
              <Button variant="outline" className="w-full text-xs" type="button">
                Sign up / Login with Phone OTP
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
  )
}
