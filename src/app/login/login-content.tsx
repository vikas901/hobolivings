'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithEmailAndPassword, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Phone, Mail, KeyRound, UserCheck, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { PasswordInput } from '@/components/ui/password-input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { UserProfile } from '@/lib/types';
import logo from '@/assets/logo.png';

export function LoginContent() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const initialAuthMode = searchParams.get('authMode') === 'otp' ? 'otp' : 'email';

  // Auth Modes: 'email' or 'otp'
  const [authMode, setAuthMode] = useState<'email' | 'otp'>(initialAuthMode);

  // Email state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Phone OTP state
  const [phoneNumber, setPhoneNumber] = useState('+91');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [otpSent, setOtpSent] = useState(false);

  // Security constraints state
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [captchaSolved, setCaptchaSolved] = useState(false);
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState(0);

  // Onboarding (New user registration via OTP)
  const [onboardingMode, setOnboardingMode] = useState(false);
  const [newUid, setNewUid] = useState('');
  const [onboardingData, setOnboardingData] = useState({
    name: '',
    email: '',
    phone: '',
    profileType: 'student', // 'student' | 'professional'
  });

  const [loading, setLoading] = useState(false);
  const recaptchaVerifierRef = useRef<any>(null);

  // Auto redirect already-logged-in users (who have a valid profile document)
  useEffect(() => {
    if (!authLoading && user && userProfile && !onboardingMode) {
      if (userProfile.isAdmin) {
        router.push('/admin');
      } else if (userProfile.activeRole === 'landlord') {
        router.push('/owner/dashboard');
      } else {
        // Retrieve and restore intent if logged in
        const intentStr = localStorage.getItem('hobo_login_intent');
        let redirectUrl = '/';
        if (intentStr) {
          try {
            const intent = JSON.parse(intentStr);
            if (intent.intent === 'BOOK') {
              redirectUrl = `/?action=book&propertyId=${intent.propertyId}`;
            } else if (intent.intent === 'SAVE_FAVORITE') {
              redirectUrl = `/?action=save&propertyId=${intent.propertyId}`;
            }
            localStorage.removeItem('hobo_login_intent');
          } catch (e) {
            console.error(e);
          }
        }
        router.push(redirectUrl);
      }
    }
  }, [user, userProfile, authLoading, onboardingMode, router]);

  // Clean up reCAPTCHA verifier if component unmounts
  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (e) {
          console.error(e);
        }
      }
    };
  }, []);

  // Load failed attempts and lockout limits from localStorage
  useEffect(() => {
    const savedAttempts = localStorage.getItem('hobo_failed_attempts');
    const savedLockout = localStorage.getItem('hobo_lockout_until');

    if (savedAttempts) setFailedAttempts(parseInt(savedAttempts, 10));
    if (savedLockout) {
      const until = parseInt(savedLockout, 10);
      if (until > Date.now()) {
        setLockoutUntil(until);
        setLockoutTimeLeft(Math.ceil((until - Date.now()) / 1000));
      }
    }
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    if (!lockoutUntil) return;
    const interval = setInterval(() => {
      const remaining = lockoutUntil - Date.now();
      if (remaining <= 0) {
        setLockoutUntil(null);
        setFailedAttempts(0);
        localStorage.removeItem('hobo_lockout_until');
        localStorage.removeItem('hobo_failed_attempts');
        setLockoutTimeLeft(0);
      } else {
        setLockoutTimeLeft(Math.ceil(remaining / 1000));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (lockoutUntil && lockoutUntil > Date.now()) {
      toast({
        variant: 'destructive',
        title: 'Account Locked',
        description: `Too many failed attempts. Try again in ${lockoutTimeLeft}s.`,
      });
      return;
    }

    if (failedAttempts >= 5 && !captchaSolved) {
      toast({
        variant: 'destructive',
        title: 'Verification Required',
        description: 'Please confirm you are not a robot.',
      });
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        throw new Error("User profile not found. Please contact support.");
      }

      const userProfileData = userDoc.data() as UserProfile;

      // Reset security limits
      setFailedAttempts(0);
      setLockoutUntil(null);
      localStorage.removeItem('hobo_failed_attempts');
      localStorage.removeItem('hobo_lockout_until');

      // Restoring Intent redirection
      const intentStr = localStorage.getItem('hobo_login_intent');
      let redirectUrl = '/';
      if (intentStr) {
        try {
          const intent = JSON.parse(intentStr);
          if (intent.intent === 'BOOK') {
            redirectUrl = `/?action=book&propertyId=${intent.propertyId}`;
          } else if (intent.intent === 'SAVE_FAVORITE') {
            redirectUrl = `/?action=save&propertyId=${intent.propertyId}`;
          }
          localStorage.removeItem('hobo_login_intent');
        } catch (err) {
          console.error(err);
        }
      }

      toast({ title: 'Success', description: 'Logged in successfully!' });
      
      if (userProfileData.activeRole === 'landlord') {
        router.push('/owner/dashboard');
      } else {
        router.push(redirectUrl);
      }

    } catch (error: any) {
      console.error(error);
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      localStorage.setItem('hobo_failed_attempts', nextAttempts.toString());
      setCaptchaSolved(false);

      if (nextAttempts >= 8) {
        const lockTime = Date.now() + 15 * 60 * 1000; // 15 mins lock
        setLockoutUntil(lockTime);
        localStorage.setItem('hobo_lockout_until', lockTime.toString());
        setLockoutTimeLeft(15 * 60);
        toast({
          variant: 'destructive',
          title: 'Account Locked',
          description: 'Too many failed login attempts. Your account has been temporarily locked for 15 minutes.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'Invalid email or password. Please try again.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const setupRecaptcha = () => {
    if (recaptchaVerifierRef.current) {
      return recaptchaVerifierRef.current;
    }
    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container-login', {
      size: 'invisible',
      callback: () => {}
    });
    recaptchaVerifierRef.current = verifier;
    return verifier;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.trim().length < 10) {
      toast({
        variant: 'destructive',
        title: 'Invalid Phone Number',
        description: 'Please enter a valid phone number with country code (e.g. +91XXXXXXXXXX)',
      });
      return;
    }

    setLoading(true);
    try {
      const verifier = setupRecaptcha();
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber.trim(), verifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      toast({ title: 'OTP Sent', description: 'A 6-digit code has been sent to your phone.' });
    } catch (err: any) {
      console.error(err);
      toast({ variant: 'destructive', title: 'Error Sending OTP', description: err.message });
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (e) {}
        recaptchaVerifierRef.current = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode || verificationCode.trim().length !== 6) {
      toast({ variant: 'destructive', title: 'Invalid Code', description: 'Please enter the 6-digit verification code.' });
      return;
    }

    setLoading(true);
    try {
      const result = await confirmationResult.confirm(verificationCode.trim());
      const user = result.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      // Reset security limits on verification success
      setFailedAttempts(0);
      setLockoutUntil(null);
      localStorage.removeItem('hobo_failed_attempts');
      localStorage.removeItem('hobo_lockout_until');

      if (userDoc.exists()) {
        const userProfileData = userDoc.data() as UserProfile;
        toast({ title: 'Success', description: 'Logged in successfully!' });
        
        // Restore intent
        const intentStr = localStorage.getItem('hobo_login_intent');
        let redirectUrl = '/';
        if (intentStr) {
          try {
            const intent = JSON.parse(intentStr);
            if (intent.intent === 'BOOK') {
              redirectUrl = `/?action=book&propertyId=${intent.propertyId}`;
            } else if (intent.intent === 'SAVE_FAVORITE') {
              redirectUrl = `/?action=save&propertyId=${intent.propertyId}`;
            }
            localStorage.removeItem('hobo_login_intent');
          } catch (ex) {
            console.error(ex);
          }
        }

        if (userProfileData.activeRole === 'landlord') {
          router.push('/owner/dashboard');
        } else {
          router.push(redirectUrl);
        }
      } else {
        // New user profile registration (Tenant by default)
        setNewUid(user.uid);
        setOnboardingMode(true);
        setOnboardingData(prev => ({
          ...prev,
          phone: user.phoneNumber || phoneNumber
        }));
        toast({ title: 'Verified', description: 'Please complete your profile details to register.' });
      }
    } catch (err: any) {
      console.error(err);
      toast({ variant: 'destructive', title: 'Verification Failed', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardingData.name.trim() || !onboardingData.email.trim()) {
      toast({ variant: 'destructive', title: 'Required Fields', description: 'Name and Email are required.' });
      return;
    }

    setLoading(true);
    try {
      const dataToSave: any = {
        uid: newUid,
        name: onboardingData.name.trim(),
        email: onboardingData.email.trim(),
        roles: ['tenant'],
        activeRole: 'tenant',
        tenantType: onboardingData.profileType as 'student' | 'professional',
        profileType: onboardingData.profileType as 'student' | 'professional',
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', newUid), dataToSave);
      toast({ title: '🎉 Registration Complete!', description: 'Your profile has been created successfully.' });

      // Restore intent
      const intentStr = localStorage.getItem('hobo_login_intent');
      let redirectUrl = '/';
      if (intentStr) {
        try {
          const intent = JSON.parse(intentStr);
          if (intent.intent === 'BOOK') {
            redirectUrl = `/?action=book&propertyId=${intent.propertyId}`;
          } else if (intent.intent === 'SAVE_FAVORITE') {
            redirectUrl = `/?action=save&propertyId=${intent.propertyId}`;
          }
          localStorage.removeItem('hobo_login_intent');
        } catch (ex) {
          console.error(ex);
        }
      }
      router.push(redirectUrl);

    } catch (err: any) {
      console.error(err);
      toast({ variant: 'destructive', title: 'Registration Failed', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Render Onboarding form if verified OTP but no profile exists
  if (onboardingMode) {
    return (
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <Link href="/" className="flex justify-center mb-4">
            <Image src={logo} alt="Hobo Livings Logo" width={140} height={40} priority />
          </Link>
          <CardTitle className="text-2xl font-headline">Complete Your Profile</CardTitle>
          <CardDescription>We just need a few more details to set up your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleOnboardingSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="onboard-name">Full Name</Label>
              <Input
                id="onboard-name"
                required
                value={onboardingData.name}
                onChange={(e) => setOnboardingData(prev => ({ ...prev, name: e.target.value }))}
                disabled={loading}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="onboard-email">Email Address</Label>
              <Input
                id="onboard-email"
                type="email"
                required
                value={onboardingData.email}
                onChange={(e) => setOnboardingData(prev => ({ ...prev, email: e.target.value }))}
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="onboard-phone">Phone Number</Label>
              <Input
                id="onboard-phone"
                disabled
                value={onboardingData.phone}
              />
            </div>

            <div>
              <Label className="font-semibold text-sm">Register me as a...</Label>
              <RadioGroup
                value={onboardingData.profileType}
                onValueChange={(val) => setOnboardingData(prev => ({ ...prev, profileType: val }))}
                disabled={loading}
                className="flex gap-4 pt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="onboard-student" />
                  <Label htmlFor="onboard-student">Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="professional" id="onboard-professional" />
                  <Label htmlFor="onboard-professional">Working Professional</Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserCheck className="mr-2 h-4 w-4" />}
              {loading ? 'Setting up Profile...' : 'Complete Registration'}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm mx-4">
      <CardHeader className="text-center">
        <Link href="/" className="flex justify-center mb-4">
          <Image src={logo} alt="Hobo Livings Logo" width={140} height={40} priority />
        </Link>
        <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
        <CardDescription>Login to access your co-living account.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={authMode} onValueChange={(val: any) => setAuthMode(val)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="email" disabled={loading || authLoading} className="flex gap-1.5 items-center">
              <Mail className="h-3.5 w-3.5" />
              <span>Email</span>
            </TabsTrigger>
            <TabsTrigger value="otp" disabled={loading || authLoading} className="flex gap-1.5 items-center">
              <Phone className="h-3.5 w-3.5" />
              <span>Phone OTP</span>
            </TabsTrigger>
          </TabsList>

          {/* Invisible Recaptcha target element */}
          <div id="recaptcha-container-login"></div>

          <TabsContent value="email">
            <form onSubmit={handleEmailLogin} className="grid gap-4">
              {lockoutUntil && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-xs font-semibold animate-pulse">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>Account locked. Please retry in {lockoutTimeLeft}s.</span>
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || authLoading || !!lockoutUntil}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <PasswordInput
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading || authLoading || !!lockoutUntil}
                />
              </div>

              {failedAttempts >= 5 && !lockoutUntil && (
                <div className="flex items-center space-x-2 border p-3 rounded-md bg-muted">
                  <Checkbox 
                    id="captcha" 
                    checked={captchaSolved} 
                    onCheckedChange={(val) => setCaptchaSolved(!!val)} 
                    disabled={loading || authLoading}
                  />
                  <Label htmlFor="captcha" className="text-xs font-semibold cursor-pointer select-none">
                    I am not a robot (Security Verification)
                  </Label>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading || authLoading || !!lockoutUntil || (failedAttempts >= 5 && !captchaSolved)}>
                {(loading || authLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {authLoading ? 'Verifying Session...' : loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="otp">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number (with Country Code)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+919876543210"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={loading || authLoading}
                  />
                  <p className="text-[10px] text-muted-foreground">Default +91 prefix for Delhi NCR/India numbers.</p>
                </div>
                <Button type="submit" className="w-full" disabled={loading || authLoading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
                  {loading ? 'Sending OTP...' : 'Send Verification OTP'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="otp">Enter 6-Digit OTP Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    pattern="\d{6}"
                    placeholder="123456"
                    required
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    disabled={loading || authLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading || authLoading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserCheck className="mr-2 h-4 w-4" />}
                  {loading ? 'Verify & Login' : 'Verify OTP & Login'}
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => {
                    setOtpSent(false);
                    setVerificationCode('');
                  }} 
                  className="text-xs w-full"
                  disabled={loading || authLoading}
                >
                  Change Phone Number
                </Button>
              </form>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="underline font-semibold text-primary">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
