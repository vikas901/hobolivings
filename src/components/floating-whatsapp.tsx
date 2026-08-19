'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Show gentle prompt after 4 seconds of browsing
    const timer = setTimeout(() => {
      if (!hasInteracted) {
        setShowTooltip(true);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [hasInteracted]);

  const handleOpenWhatsApp = () => {
    setHasInteracted(true);
    setShowTooltip(false);
    const message = `Hi Hobo Livings! 👋 I need help finding a verified student hostel or PG with zero brokerage. Can you help me find the best room near my college/locality?`;
    window.open(`https://wa.me/918920642742?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 group print:hidden">
      {/* Floating Notification Tooltip / Speech Bubble */}
      {showTooltip && (
        <div className="relative bg-background border shadow-2xl rounded-2xl p-3.5 max-w-[260px] text-left animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
              setHasInteracted(true);
            }}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground h-4 w-4 flex items-center justify-center rounded-full"
            aria-label="Dismiss message"
          >
            <X className="h-3 w-3" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs font-bold text-foreground">Hobo Housing Assistant</p>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Need help finding safe, verified PGs near your campus with ₹0 brokerage?
          </p>
          <button
            onClick={handleOpenWhatsApp}
            className="mt-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            Chat with us on WhatsApp →
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <Button
        onClick={handleOpenWhatsApp}
        className="h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center p-0 border-2 border-white dark:border-slate-800"
        aria-label="Chat on WhatsApp with Hobo Livings"
        title="Chat with Hobo Livings on WhatsApp"
      >
        <MessageCircle className="h-7 w-7 fill-white text-white" />
        <span className="sr-only">Chat on WhatsApp</span>
      </Button>
    </div>
  );
}
