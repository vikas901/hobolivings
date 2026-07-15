'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { IndianRupee } from 'lucide-react';

/**
 * Formats a number using the Indian numbering system.
 * e.g., 125000 → "1,25,000"
 */
function formatIndianCurrency(value: number): string {
  if (isNaN(value) || value === 0) return '';
  const str = Math.floor(value).toString();
  // Indian system: last 3 digits, then groups of 2
  if (str.length <= 3) return str;
  const lastThree = str.slice(-3);
  const remaining = str.slice(0, -3);
  const formatted = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${formatted},${lastThree}`;
}

/**
 * Strips all non-digit characters from a string and returns a number.
 */
function parseRawValue(display: string): number {
  const digits = display.replace(/[^0-9]/g, '');
  return digits ? parseInt(digits, 10) : 0;
}

export interface CurrencyInputProps {
  value?: number;
  onChange?: (value: number) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
  min?: number;
  max?: number;
  'aria-label'?: string;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value = 0, onChange, placeholder = '0', disabled, className, min, max, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState<string>(
      value > 0 ? formatIndianCurrency(value) : ''
    );

    // Sync with external value changes (e.g., form reset)
    React.useEffect(() => {
      const formatted = value > 0 ? formatIndianCurrency(value) : '';
      setDisplayValue(formatted);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const numericValue = parseRawValue(raw);

      // Apply max constraint
      if (max !== undefined && numericValue > max) return;

      const formatted = numericValue > 0 ? formatIndianCurrency(numericValue) : '';
      setDisplayValue(formatted);
      onChange?.(numericValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow: backspace, delete, tab, escape, enter, arrows
      const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
      if (allowedKeys.includes(e.key)) return;

      // Allow Ctrl/Cmd + A, C, V, X
      if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) return;

      // Block non-numeric keys
      if (!/^\d$/.test(e.key)) {
        e.preventDefault();
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text');
      const numericValue = parseRawValue(pasted);
      if (max !== undefined && numericValue > max) return;
      const formatted = numericValue > 0 ? formatIndianCurrency(numericValue) : '';
      setDisplayValue(formatted);
      onChange?.(numericValue);
    };

    return (
      <div className={cn(
        "flex items-center h-10 w-full rounded-md border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}>
        <span className="flex items-center justify-center px-3 text-muted-foreground border-r border-input bg-muted/30 h-full rounded-l-md">
          <IndianRupee className="h-4 w-4" />
        </span>
        <input
          ref={ref}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed"
          {...props}
        />
        {displayValue && (
          <span className="pr-3 text-xs text-muted-foreground whitespace-nowrap">/mo</span>
        )}
      </div>
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';

export { CurrencyInput, formatIndianCurrency };
