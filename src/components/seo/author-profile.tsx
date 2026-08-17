import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Linkedin, Calendar, CheckCircle } from 'lucide-react';

interface AuthorProfileProps {
  author: {
    name: string;
    role: string;
    avatar: string;
    linkedin?: string;
  };
  publishedDate: string;
  updatedDate: string;
  readTime: string;
}

export function AuthorProfile({
  author,
  publishedDate,
  updatedDate,
  readTime,
}: AuthorProfileProps) {
  return (
    <div className="my-6 rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        {/* Author Avatar & Bio */}
        <div className="flex items-center gap-3.5">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-primary/20 bg-muted">
            <Image
              src={author.avatar}
              alt={author.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-headline font-bold text-base text-foreground">
              <span>{author.name}</span>
              <span title="Verified Author & Housing Expert">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {author.role}
            </p>
          </div>
        </div>

        {/* Date & Meta Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1 bg-secondary px-2.5 py-1 rounded-full">
            <Calendar className="h-3 w-3 text-primary" />
            <span>Updated: {updatedDate}</span>
          </div>
          <div className="flex items-center gap-1 bg-secondary px-2.5 py-1 rounded-full">
            <span>⏱️ {readTime}</span>
          </div>
          {author.linkedin && (
            <a
              href={author.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:underline bg-primary/10 px-2.5 py-1 rounded-full font-medium"
            >
              <Linkedin className="h-3 w-3" />
              <span>Verify Bio</span>
            </a>
          )}
        </div>

      </div>

      {/* E-E-A-T Editorial Disclaimer */}
      <div className="mt-3.5 pt-3 border-t border-border/40 flex items-center gap-2 text-[11px] text-muted-foreground">
        <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
        <span>
          Fact-checked by Hobo Livings On-Ground Verification Team for Academic Year 2026–2027.
        </span>
      </div>
    </div>
  );
}
