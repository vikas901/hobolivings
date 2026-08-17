import React from 'react';
import Link from 'next/link';
import { GUIDES_DATA, GuideArticle } from '@/lib/guides-data';
import { BookOpen, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TopicClusterNavProps {
  currentSlug: string;
}

export function TopicClusterNav({ currentSlug }: TopicClusterNavProps) {
  const currentGuide = GUIDES_DATA[currentSlug];
  const pillarGuide = GUIDES_DATA['student-housing-guide'];
  const allGuides = Object.values(GUIDES_DATA);

  return (
    <div className="my-10 rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-secondary/30 via-background to-background p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h3 className="font-headline font-bold text-base text-foreground">
            Complete Student Housing Topic Cluster (2026)
          </h3>
        </div>
        <Badge variant="outline" className="text-[10px] uppercase font-bold text-primary border-primary/30 w-fit">
          Topical Depth & Mastery
        </Badge>
      </div>

      {/* Main Pillar Link Card (If we are on a subtopic page) */}
      {!currentGuide?.isPillar && pillarGuide && (
        <div className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase font-bold text-primary tracking-wider flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Core Pillar Guide
            </div>
            <Link 
              href={`/guides/${pillarGuide.slug}`} 
              className="font-headline font-bold text-sm text-foreground hover:text-primary transition-colors block mt-0.5"
            >
              {pillarGuide.title}
            </Link>
          </div>
          <Link
            href={`/guides/${pillarGuide.slug}`}
            className="shrink-0 text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
          >
            Read Pillar Guide <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      {/* Sibling Subtopic Guides */}
      <div className="mt-4 space-y-2.5">
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Explore Related Subtopic Guides in this Cluster:
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {allGuides.map((guide) => {
            const isCurrent = guide.slug === currentSlug;
            return (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className={`p-3.5 rounded-xl border transition-all flex items-start gap-2.5 text-xs ${
                  isCurrent
                    ? 'bg-primary/10 border-primary font-bold text-primary shadow-xs'
                    : 'bg-card border-border/80 text-foreground hover:border-primary/40 hover:bg-muted/30'
                }`}
              >
                {isCurrent ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                ) : (
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
                )}
                <div>
                  <span className="line-clamp-2 leading-snug">{guide.title}</span>
                  <span className="text-[10px] text-muted-foreground block mt-1">
                    {guide.category} • {guide.readTime}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
