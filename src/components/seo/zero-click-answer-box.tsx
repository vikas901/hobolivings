'use client';

import React from 'react';
import { Sparkles, CheckCircle2, Volume2, ShieldCheck } from 'lucide-react';

interface ZeroClickAnswerBoxProps {
  question?: string;
  summary: string;
  keyTakeaways?: string[];
  citationSource?: string;
  updatedDate?: string;
}

export function ZeroClickAnswerBox({
  question,
  summary,
  keyTakeaways = [],
  citationSource = 'Verified by Hobo Livings Housing Team (Academic Year 2026-27)',
  updatedDate = 'Updated for 2026 Admissions',
}: ZeroClickAnswerBoxProps) {
  return (
    <section 
      aria-label="Direct Quick Answer" 
      className="my-6 rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-orange-500/5 p-6 shadow-sm"
    >
      <div className="flex items-center justify-between gap-3 border-b border-primary/15 pb-3">
        <div className="flex items-center gap-2 text-primary font-headline font-bold text-sm tracking-wide uppercase">
          <Sparkles className="h-4 w-4 animate-pulse text-primary" />
          <span>Quick Answer & Summary</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>{updatedDate}</span>
        </div>
      </div>

      {question && (
        <h3 className="mt-3 text-lg font-bold text-foreground font-headline">
          {question}
        </h3>
      )}

      {/* 40-50 Word Direct Definition with Speakable CSS Selector */}
      <p 
        id="zero-click-summary" 
        className="mt-3 text-base leading-relaxed font-medium text-foreground/90 bg-background/80 rounded-xl p-4 border border-border/60 shadow-xs"
      >
        {summary}
      </p>

      {/* Key Takeaways / Micro-content for Google SGE & AI Overviews */}
      {keyTakeaways.length > 0 && (
        <div id="key-takeaways" className="mt-4 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Key Takeaways:
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-foreground/80">
            {keyTakeaways.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {citationSource && (
        <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
          <span>{citationSource}</span>
          <span className="inline-flex items-center gap-1 text-primary/80 font-medium">
            <Volume2 className="h-3.5 w-3.5" /> Voice Search Optimized
          </span>
        </div>
      )}
    </section>
  );
}

interface ComparisonTableProps {
  title: string;
  columns: string[];
  rows: {
    feature: string;
    col1: string;
    col2: string;
    col3?: string;
  }[];
}

export function ComparisonMatrix({ title, columns, rows }: ComparisonTableProps) {
  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="bg-muted/50 p-4 border-b border-border">
        <h4 className="font-headline font-bold text-base text-foreground flex items-center gap-2">
          <span>📊</span> {title}
        </h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/80 text-xs uppercase font-bold text-muted-foreground border-b border-border">
            <tr>
              <th className="py-3 px-4">Feature / Aspect</th>
              <th className="py-3 px-4 text-primary font-bold">{columns[0]}</th>
              <th className="py-3 px-4">{columns[1]}</th>
              {columns[2] && <th className="py-3 px-4">{columns[2]}</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4 font-semibold text-foreground">{row.feature}</td>
                <td className="py-3 px-4 font-medium text-foreground bg-primary/5">{row.col1}</td>
                <td className="py-3 px-4 text-muted-foreground">{row.col2}</td>
                {row.col3 && <td className="py-3 px-4 text-muted-foreground">{row.col3}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
