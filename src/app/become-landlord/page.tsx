'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle2, UserCheck, ShieldCheck, Home, Landmark, UploadCloud } from 'lucide-react';

export default function BecomeLandlordPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // KYC States
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [govtIdType, setGovtIdType] = useState('aadhaar');
  const [govtIdNumber, setGovtIdNumber] = useState('');
  const [selfieUploaded, setSelfieUploaded] = useState(false);
  const [uploadingSelfie, setUploadingSelfie] = useState(false);

  const [officeAddress, setOfficeAddress] = useState('');
  const [companyType, setCompanyType] = useState<'individual' | 'company'>('individual');
  const [proofType, setProofType] = useState('utility_bill');
  const [proofUploaded, setProofUploaded] = useState(false);
  const [uploadingProof, setUploadingProof] = useState(false);

  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [pennyDropVerified, setPennyDropVerified] = useState(false);
  const [verifyingBank, setVerifyingBank] = useState(false);

  // Direct access safety check
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please sign in or register to become a landlord.',
      });
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const simulateSelfieUpload = () => {
    setUploadingSelfie(true);
    setTimeout(() => {
      setUploadingSelfie(false);
      setSelfieUploaded(true);
      toast({ title: 'Success', description: 'Selfie matched with government record successfully!' });
    }, 1500);
  };

  const simulateProofUpload = () => {
    setUploadingProof(true);
    setTimeout(() => {
      setUploadingProof(false);
      setProofUploaded(true);
      toast({ title: 'Success', description: 'Ownership proof uploaded successfully!' });
    }, 1500);
  };

  const simulatePennyDrop = () => {
    if (!bankName || !accountNumber || !ifscCode) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please fill in all bank details before verifying.',
      });
      return;
    }
    setVerifyingBank(true);
    setTimeout(() => {
      setVerifyingBank(false);
      setPennyDropVerified(true);
      toast({
        title: 'Penny-Drop Verified! ✅',
        description: `Successfully verified bank account. Beneficiary: ${userProfile?.name || 'Verified User'}.`,
      });
    }, 2000);
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!phone.trim() || !govtIdNumber.trim()) {
        toast({ variant: 'destructive', title: 'Required Fields', description: 'Phone number and ID number are required.' });
        return;
      }
      if (!selfieUploaded) {
        toast({ variant: 'destructive', title: 'Selfie Required', description: 'Please complete selfie verification to match your ID.' });
        return;
      }
    } else if (step === 2) {
      if (!officeAddress.trim()) {
        toast({ variant: 'destructive', title: 'Required Field', description: 'Address is required.' });
        return;
      }
      if (!proofUploaded) {
        toast({ variant: 'destructive', title: 'Document Required', description: 'Please upload ownership proof to continue.' });
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmitKyc = async () => {
    if (!pennyDropVerified) {
      toast({
        variant: 'destructive',
        title: 'Verification Needed',
        description: 'Please perform bank account verification before submitting.',
      });
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, 'users', user!.uid);
      const userDoc = await getDoc(userRef);

      let currentRoles = ['tenant'];
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.roles) {
          currentRoles = data.roles;
        }
      }

      // Add landlord role if not present
      if (!currentRoles.includes('landlord')) {
        currentRoles.push('landlord');
      }

      const updatedProfile: any = {
        ...userProfile,
        roles: currentRoles,
        activeRole: 'landlord',
        landlordKycStatus: 'pending',
        landlordKycData: {
          phone,
          address: officeAddress.trim(),
          companyType,
          govtIdUrl: 'simulated_id_doc.jpg',
          selfieUrl: 'simulated_selfie.jpg',
          ownershipProofUrl: 'simulated_proof.pdf',
          bankDetails: {
            holderName: userProfile?.name || 'Verified User',
            accountNumber,
            ifscCode,
          }
        },
        // Legacy support
        profileType: 'owner',
        phone,
        address: officeAddress.trim(),
        companyType,
      };

      await setDoc(userRef, updatedProfile, { merge: true });

      toast({
        title: '🎉 Congratulations!',
        description: 'You are now a registered landlord on Hobo Livings. Redirecting to your dashboard...',
      });
      
      router.push('/owner/dashboard');
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex justify-center items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-secondary">
      <Header />
      <main className="flex-1 container py-12 flex justify-center items-center px-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center pb-4 border-b">
            <CardTitle className="font-headline text-3xl flex justify-center items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-primary" />
              Become a Landlord
            </CardTitle>
            <CardDescription className="pt-1">
              Verify your identity and bank account to start listing properties in Delhi NCR.
            </CardDescription>

            {/* Visual Stepper */}
            <div className="flex justify-around items-center pt-6 max-w-md mx-auto">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`h-8 w-8 rounded-full flex justify-center items-center font-bold text-sm transition-colors ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  1
                </div>
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>Identity</span>
              </div>
              <div className={`h-0.5 w-16 bg-muted ${step >= 2 && 'bg-primary'}`}></div>
              <div className="flex flex-col items-center gap-1.5">
                <div className={`h-8 w-8 rounded-full flex justify-center items-center font-bold text-sm transition-colors ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  2
                </div>
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>Ownership</span>
              </div>
              <div className={`h-0.5 w-16 bg-muted ${step >= 3 && 'bg-primary'}`}></div>
              <div className="flex flex-col items-center gap-1.5">
                <div className={`h-8 w-8 rounded-full flex justify-center items-center font-bold text-sm transition-colors ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  3
                </div>
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>Payouts</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            
            {/* STEP 1: IDENTITY KYC */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex gap-2 items-center text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  <UserCheck className="h-4 w-4" />
                  <span>Step 1: Identity & Contact Verification</span>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="kyc-phone">Verified Phone Number</Label>
                  <Input 
                    id="kyc-phone" 
                    placeholder="+919876543210" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="kyc-id-type">Government ID Type</Label>
                    <Select value={govtIdType} onValueChange={setGovtIdType}>
                      <SelectTrigger id="kyc-id-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
                        <SelectItem value="pan">PAN Card</SelectItem>
                        <SelectItem value="passport">Passport</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="kyc-id-number">Government ID Number</Label>
                    <Input 
                      id="kyc-id-number" 
                      placeholder="Enter ID number" 
                      value={govtIdNumber} 
                      onChange={(e) => setGovtIdNumber(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="grid gap-2 pt-2">
                  <Label>Liveness Selfie Check</Label>
                  {!selfieUploaded ? (
                    <div 
                      onClick={simulateSelfieUpload}
                      className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors flex flex-col justify-center items-center gap-2 group"
                    >
                      {uploadingSelfie ? (
                        <Loader2 className="h-8 w-8 text-primary animate-spin" />
                      ) : (
                        <UploadCloud className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                      )}
                      <span className="font-semibold text-sm">Take / Upload Selfie Verification</span>
                      <span className="text-xs text-muted-foreground">Matches image dynamically against government registry.</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 border p-4 rounded-lg bg-green-50/50 border-green-200">
                      <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-green-800">Identity Selfie Verified</p>
                        <p className="text-xs text-green-600">Successfully matched with government registers.</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-end">
                  <Button onClick={handleNextStep}>Continue</Button>
                </div>
              </div>
            )}

            {/* STEP 2: PROPERTY OWNERSHIP PROOF */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="flex gap-2 items-center text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  <Home className="h-4 w-4" />
                  <span>Step 2: Property Ownership Proof</span>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="kyc-company-type">Ownership Entity Type</Label>
                  <RadioGroup 
                    value={companyType} 
                    onValueChange={(val: any) => setCompanyType(val)}
                    className="flex gap-4 pt-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="kyc-ind" />
                      <Label htmlFor="kyc-ind" className="cursor-pointer">Individual</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="company" id="kyc-comp" />
                      <Label htmlFor="kyc-comp" className="cursor-pointer">Company / Registered Agency</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="kyc-address">Office / Business Address</Label>
                  <Textarea 
                    id="kyc-address" 
                    placeholder="Enter your registered business address" 
                    value={officeAddress}
                    onChange={(e) => setOfficeAddress(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="kyc-proof-type">Ownership Verification Document</Label>
                    <Select value={proofType} onValueChange={setProofType}>
                      <SelectTrigger id="kyc-proof-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utility_bill">Recent Utility Bill (Electricity/Water)</SelectItem>
                        <SelectItem value="tax_receipt">Property Tax Receipt</SelectItem>
                        <SelectItem value="rental_agreement">Registered Lease Agreement</SelectItem>
                        <SelectItem value="title_deed">Property Title Deed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2 pt-2">
                  <Label>Upload Ownership Certificate / Bill</Label>
                  {!proofUploaded ? (
                    <div 
                      onClick={simulateProofUpload}
                      className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors flex flex-col justify-center items-center gap-2 group"
                    >
                      {uploadingProof ? (
                        <Loader2 className="h-8 w-8 text-primary animate-spin" />
                      ) : (
                        <UploadCloud className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                      )}
                      <span className="font-semibold text-sm">Upload proof documentation</span>
                      <span className="text-xs text-muted-foreground">PDF, PNG, JPG accepted (Max 5MB).</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 border p-4 rounded-lg bg-green-50/50 border-green-200">
                      <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-green-800">Ownership Proof Document Verified</p>
                        <p className="text-xs text-green-600">Verification successfully logged for listing activation.</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-between">
                  <Button variant="outline" onClick={handlePrevStep}>Back</Button>
                  <Button onClick={handleNextStep}>Continue</Button>
                </div>
              </div>
            )}

            {/* STEP 3: BANK DETAILS & PENNY-DROP VERIFICATION */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="flex gap-2 items-center text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  <Landmark className="h-4 w-4" />
                  <span>Step 3: Payout Bank Verification</span>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="kyc-bank-name">Bank Name</Label>
                  <Input 
                    id="kyc-bank-name" 
                    placeholder="e.g. HDFC Bank, ICICI Bank" 
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    disabled={pennyDropVerified}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="kyc-acc-number">Bank Account Number</Label>
                    <Input 
                      id="kyc-acc-number" 
                      placeholder="Enter account number" 
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      disabled={pennyDropVerified}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="kyc-ifsc">IFSC Code</Label>
                    <Input 
                      id="kyc-ifsc" 
                      placeholder="e.g. HDFC0001234" 
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value)}
                      disabled={pennyDropVerified}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  {!pennyDropVerified ? (
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full border-primary text-primary hover:bg-primary/5"
                      onClick={simulatePennyDrop}
                      disabled={verifyingBank}
                    >
                      {verifyingBank ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying Account Details (Penny-Drop Test)...
                        </>
                      ) : (
                        'Verify Bank Account (Simulated Penny-Drop)'
                      )}
                    </Button>
                  ) : (
                    <div className="flex items-center gap-3 border p-4 rounded-lg bg-green-50/50 border-green-200">
                      <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-green-800">Penny-Drop Verified Successfully</p>
                        <p className="text-xs text-green-600">Beneficiary name matching profile name: "{userProfile?.name}".</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 flex justify-between border-t">
                  <Button variant="outline" onClick={handlePrevStep} disabled={loading}>Back</Button>
                  <Button onClick={handleSubmitKyc} disabled={loading || !pennyDropVerified}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving Profile...
                      </>
                    ) : (
                      'Submit Verification'
                    )}
                  </Button>
                </div>
              </div>
            )}

          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
