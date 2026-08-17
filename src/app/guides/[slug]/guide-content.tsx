'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { GuideArticle } from '@/lib/guides-data';
import { CAMPUS_HUBS } from '@/lib/campus-data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  BookOpen, 
  HelpCircle, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  Share2,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { ZeroClickAnswerBox } from '@/components/seo/zero-click-answer-box';
import { AuthorProfile } from '@/components/seo/author-profile';
import { TopicClusterNav } from '@/components/seo/topic-cluster-nav';

interface GuideContentProps {
  guide: GuideArticle;
}

export default function GuideContent({ guide }: GuideContentProps) {
  const relatedCampuses = guide.relatedCampusSlugs.map((slug) => CAMPUS_HUBS[slug]).filter(Boolean);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      {/* Breadcrumbs */}
      <nav className="bg-secondary/30 border-b py-2.5 px-4 text-xs font-medium text-muted-foreground" aria-label="Breadcrumb">
        <div className="container max-w-4xl mx-auto flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/guides" className="hover:text-foreground transition-colors">Student Guides</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-semibold truncate max-w-[200px] sm:max-w-md">{guide.title}</span>
        </div>
      </nav>

      {/* Article Header & Main Container */}
      <main className="container max-w-4xl mx-auto py-10 px-4 space-y-8 flex-1">
        
        {/* Category & Title */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/30 font-bold text-xs uppercase px-3 py-1">
              {guide.category}
            </Badge>
            {guide.isPillar && (
              <Badge className="bg-primary text-primary-foreground font-bold text-xs">
                ⭐ Pillar Guide
              </Badge>
            )}
          </div>

          <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight">
            {guide.title}
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {guide.metaDescription}
          </p>
        </div>

        {/* E-E-A-T Author Card */}
        <AuthorProfile
          author={guide.author}
          publishedDate={guide.publishedDate}
          updatedDate={guide.updatedDate}
          readTime={guide.readTime}
        />

        {/* Hero Image */}
        <div className="relative h-64 sm:h-96 w-full rounded-3xl overflow-hidden border shadow-md">
          <Image
            src={guide.heroImage}
            alt={guide.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Zero-Click Quick Answer Box (Google SGE / Snippet optimization) */}
        <ZeroClickAnswerBox
          summary={guide.zeroClickSummary}
          keyTakeaways={guide.keyTakeaways}
          citationSource={`Published by ${guide.author.name} • Hobo Livings Editorial`}
          updatedDate={`Updated ${guide.updatedDate}`}
        />

        {/* Table of Contents */}
        {guide.tableOfContents.length > 0 && (
          <div className="my-8 rounded-2xl border bg-muted/30 p-6 space-y-3">
            <div className="flex items-center gap-2 font-headline font-bold text-sm uppercase tracking-wider text-foreground">
              <BookOpen className="h-4 w-4 text-primary" /> Table of Contents
            </div>
            <ul className="space-y-2 text-sm">
              {guide.tableOfContents.map((toc) => (
                <li key={toc.id}>
                  <a
                    href={`#${toc.id}`}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 hover:translate-x-1 duration-150"
                  >
                    <ChevronRight className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{toc.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Article Body Sections */}
        <article className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          {guide.contentSections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-20 space-y-3">
              <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-foreground border-b border-border/60 pb-2">
                {section.heading}
              </h2>

              <p className="text-base text-foreground/90 leading-relaxed">
                {section.body}
              </p>

              {section.bulletPoints && (
                <ul className="space-y-2 my-4 pl-0 list-none">
                  {section.bulletPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-foreground/80">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-1" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.calloutBox && (
                <div className="my-5 rounded-2xl bg-primary/5 border border-primary/20 p-5 shadow-xs">
                  <div className="font-headline font-bold text-sm text-primary mb-1">
                    {section.calloutBox.title}
                  </div>
                  <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                    {section.calloutBox.text}
                  </p>
                </div>
              )}
            </section>
          ))}
        </article>

        {/* FAQ Section */}
        {guide.faqs.length > 0 && (
          <section className="my-12 space-y-6 pt-6 border-t">
            <div className="space-y-1">
              <Badge className="bg-primary/10 text-primary border-primary/30 font-bold text-xs uppercase px-3 py-1">
                Frequently Asked Questions
              </Badge>
              <h3 className="font-headline text-2xl sm:text-3xl font-extrabold text-foreground">
                Common Student Questions
              </h3>
            </div>

            <div className="space-y-3">
              {guide.faqs.map((faq, idx) => (
                <Card key={idx} className="border bg-card">
                  <CardContent className="p-5 space-y-2">
                    <h4 className="font-headline font-bold text-base text-foreground flex items-start gap-2">
                      <HelpCircle className="h-4 w-4 text-primary shrink-0 mt-1" />
                      <span>{faq.question}</span>
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Bidirectional Topic Cluster Navigation */}
        <TopicClusterNav currentSlug={guide.slug} />

        {/* Relevant College Campus Hubs Cross-Links */}
        {relatedCampuses.length > 0 && (
          <section className="my-10 rounded-2xl border bg-secondary/30 p-6 space-y-4">
            <h4 className="font-headline font-bold text-base text-foreground flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Verified Student Accommodations Near Relevant Campuses:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {relatedCampuses.map((campus) => (
                <Link
                  key={campus.slug}
                  href={`/campuses/${campus.slug}`}
                  className="p-3.5 rounded-xl bg-card border hover:border-primary/50 transition-all flex flex-col justify-between group shadow-xs"
                >
                  <div className="font-bold text-xs text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                    <span>{campus.shortName}</span>
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[11px] text-muted-foreground mt-1">
                    {campus.locality}
                  </span>
                  <span className="text-[10px] text-primary font-bold mt-2">
                    {campus.avgRent.split(' ')[0]} /mo • 0 Brokerage
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
}
