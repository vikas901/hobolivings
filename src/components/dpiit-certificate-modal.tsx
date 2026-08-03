'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, ShieldCheck, ExternalLink, CheckCircle2, FileText, Calendar, Building2 } from 'lucide-react';

interface DpiitCertificateModalProps {
  variant?: 'badge' | 'button' | 'card' | 'footer';
  className?: string;
}

export default function DpiitCertificateModal({ variant = 'badge', className = '' }: DpiitCertificateModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === 'badge' ? (
          <button 
            type="button" 
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-orange-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-300 hover:border-amber-500/60 transition-all text-xs font-semibold shadow-sm cursor-pointer ${className}`}
          >
            <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="font-bold">#startupindia</span>
            <span className="text-muted-foreground">|</span>
            <span className="truncate">DPIIT Recognized (Cert: DIPP104245)</span>
            <ExternalLink className="h-3 w-3 text-amber-600/70 shrink-0 ml-0.5" />
          </button>
        ) : variant === 'button' ? (
          <Button 
            variant="outline" 
            size="sm" 
            className={`gap-2 border-amber-500/40 hover:bg-amber-50 dark:hover:bg-amber-950/30 font-semibold text-xs text-amber-950 dark:text-amber-200 ${className}`}
          >
            <Award className="h-4 w-4 text-amber-600 shrink-0" />
            <span>View DPIIT Certificate</span>
          </Button>
        ) : variant === 'footer' ? (
          <button 
            type="button" 
            className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300 hover:underline cursor-pointer group"
          >
            <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0 group-hover:scale-110 transition-transform" />
            <span>DPIIT Recognized Startup (Cert: DIPP104245)</span>
          </button>
        ) : (
          <div className={`p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 hover:border-amber-500/40 transition-all cursor-pointer space-y-3 ${className}`}>
            <div className="flex items-center justify-between">
              <Badge className="bg-amber-500/20 text-amber-900 dark:text-amber-200 border-amber-500/30 font-bold text-[10px] uppercase tracking-wider">
                Govt of India Recognized
              </Badge>
              <Award className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-headline font-bold text-sm text-foreground flex items-center gap-1.5">
                #startupindia Recognition
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                DPIIT Certificate No: <strong className="text-foreground">DIPP104245</strong>
              </p>
            </div>
            <Button size="sm" variant="secondary" className="w-full text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 dark:text-amber-200">
              View Official Certificate
            </Button>
          </div>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <DialogHeader className="space-y-2 border-b pb-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-500 text-white font-bold text-xs uppercase px-2.5 py-0.5">
              Official Accreditation
            </Badge>
            <Badge variant="outline" className="text-xs font-semibold border-amber-500/40 text-amber-700 dark:text-amber-300">
              Cert No: DIPP104245
            </Badge>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-headline font-extrabold flex items-center gap-2">
            <Award className="h-6 w-6 text-amber-600 shrink-0" />
            Startup India Certificate of Recognition
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
            Issued by the Department for Promotion of Industry and Internal Trade (DPIIT), Ministry of Commerce & Industry, Government of India.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Certificate Image Frame */}
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border shadow-lg bg-black/5 dark:bg-white/5 group">
            <Image
              src="/dpiit-certificate.png"
              alt="DPIIT #startupindia Certificate of Recognition - Hobo Livings Private Limited"
              fill
              className="object-contain p-2"
              priority
            />
          </div>

          {/* Certificate Key Verification Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-secondary/30 p-5 rounded-2xl border text-xs">
            <div className="space-y-1">
              <span className="text-muted-foreground font-medium block">Recognized Entity:</span>
              <strong className="text-foreground font-headline text-sm flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-primary shrink-0" />
                HOBO LIVINGS PRIVATE LIMITED
              </strong>
            </div>

            <div className="space-y-1">
              <span className="text-muted-foreground font-medium block">Certificate Number:</span>
              <strong className="text-foreground font-mono text-sm font-bold flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-amber-600 shrink-0" />
                DIPP104245
              </strong>
            </div>

            <div className="space-y-1">
              <span className="text-muted-foreground font-medium block">Industry & Sector:</span>
              <strong className="text-foreground font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                Real Estate Industry & Housing Sector
              </strong>
            </div>

            <div className="space-y-1">
              <span className="text-muted-foreground font-medium block">Validity Period:</span>
              <strong className="text-foreground font-semibold flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-blue-600 shrink-0" />
                03-07-2022 to 14-12-2031
              </strong>
            </div>
          </div>

          <div className="text-[11px] text-muted-foreground leading-relaxed bg-amber-500/5 p-4 rounded-xl border border-amber-500/20 space-y-1">
            <p className="font-bold text-amber-900 dark:text-amber-200">Official Government Endorsement:</p>
            <p>
              Hobo Livings Private Limited (Incorporated on 15-12-2021) is self-certified and officially recognized as a tech-enabled startup by DPIIT, Government of India, delivering transparent housing and rental solutions across India.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
