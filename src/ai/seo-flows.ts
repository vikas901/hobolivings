import { ai } from './genkit';
import { z } from 'zod';

/**
 * 1. AI-Powered SEO Content Brief Generator Flow (2026 Standard)
 */
export const SeoBriefInputSchema = z.object({
  topicOrKeyword: z.string().describe('Target search query or campus hub name, e.g. "PG near Sharda University"'),
  targetAudience: z.enum(['students', 'parents', 'working_professionals']).default('students'),
  intentType: z.enum(['informational', 'commercial', 'navigational', 'transactional']).default('commercial'),
});

export const SeoBriefOutputSchema = z.object({
  metaTitle: z.string(),
  metaDescription: z.string(),
  targetH1: z.string(),
  zeroClickAnswerTarget: z.string().describe('40-50 word direct definition for Google AI Overview / Featured Snippet'),
  suggestedH2Headings: z.array(z.string()),
  peopleAlsoAskQuestions: z.array(
    z.object({
      question: z.string(),
      recommendedAnswerAngle: z.string(),
    })
  ),
  requiredSchemaTypes: z.array(z.string()),
  eeatChecklist: z.array(z.string()),
});

export const generateSeoBriefFlow = ai.defineFlow(
  {
    name: 'generateSeoBriefFlow',
    inputSchema: SeoBriefInputSchema,
    outputSchema: SeoBriefOutputSchema,
  },
  async (input) => {
    const prompt = `
You are a World-Class 2026 SEO Architect for Hobo Livings (a verified student housing and PG platform in Greater Noida & Noida with ₹0 brokerage).

Generate an actionable, high-impact 2026 SEO content brief for the topic: "${input.topicOrKeyword}".
Target Audience: ${input.targetAudience}
Intent Type: ${input.intentType}

Ensure:
1. Meta title includes high-intent terms and brand token (e.g. ₹0 Brokerage).
2. "zeroClickAnswerTarget" is exactly 40-50 words, concise, direct, and factual.
3. 4-6 conversational H2 headings (using 5W1H triggers where suitable).
4. 3-4 People Also Ask (PAA) questions with direct answer angles.
5. Recommended JSON-LD schemas (FAQPage, LodgingBusiness, BreadcrumbList, SpeakableSpecification, etc.).
6. Actionable E-E-A-T trust signals checklist (verified rent figures, mess menu checks, inspection dates).
`;

    const response = await ai.generate({
      prompt,
      output: {
        schema: SeoBriefOutputSchema,
      },
    });

    return response.output!;
  }
);

/**
 * 2. On-Page SEO Health & Content Audit Flow
 */
export const ContentAuditInputSchema = z.object({
  pageTitle: z.string(),
  contentBody: z.string(),
  primaryKeyword: z.string(),
});

export const ContentAuditOutputSchema = z.object({
  readabilityScore: z.number().min(0).max(100),
  sxoFrictionScore: z.number().min(0).max(100).describe('Lower is better, measures jargon/clutter'),
  zeroClickReadiness: z.boolean(),
  eeatStrengthRating: z.enum(['weak', 'moderate', 'strong']),
  criticalIssues: z.array(z.string()),
  optimizationRecommendations: z.array(z.string()),
});

export const auditContentHealthFlow = ai.defineFlow(
  {
    name: 'auditContentHealthFlow',
    inputSchema: ContentAuditInputSchema,
    outputSchema: ContentAuditOutputSchema,
  },
  async (input) => {
    const prompt = `
Analyze the following student housing web page content against 2026 SEO & SXO benchmarks:
Primary Keyword: ${input.primaryKeyword}
Page Title: ${input.pageTitle}
Content:
"""
${input.contentBody}
"""

Evaluate:
- Readability & short paragraph scannability (0-100)
- SXO Friction score (0-100, 0 = no friction)
- Whether a 40-50 word direct zero-click answer exists at the top
- E-E-A-T signals (verified data, author attribution, transparent pricing)
- List specific actionable recommendations.
`;

    const response = await ai.generate({
      prompt,
      output: {
        schema: ContentAuditOutputSchema,
      },
    });

    return response.output!;
  }
);
