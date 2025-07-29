'use server';

/**
 * @fileOverview An AI agent that suggests related articles and blog posts
 * based on a property or location.
 *
 * - generateRelatedArticles - A function that generates related articles.
 * - RelatedArticleInput - The input type for the generateRelatedArticles function.
 * - RelatedArticleOutput - The return type for the generateRelatedArticles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RelatedArticleInputSchema = z.object({
  query: z.string().describe('The property or location to find related articles for.'),
});
export type RelatedArticleInput = z.infer<typeof RelatedArticleInputSchema>;

const RelatedArticleOutputSchema = z.object({
  articles: z.array(
    z.object({
      title: z.string().describe('The title of the article.'),
      url: z.string().describe('The URL of the article.'),
      summary: z.string().describe('A brief summary of the article.'),
    })
  ).describe('A list of related articles.'),
});
export type RelatedArticleOutput = z.infer<typeof RelatedArticleOutputSchema>;

export async function generateRelatedArticles(input: RelatedArticleInput): Promise<RelatedArticleOutput> {
  return relatedArticleGeneratorFlow(input);
}

const relatedArticlePrompt = ai.definePrompt({
  name: 'relatedArticlePrompt',
  input: {schema: RelatedArticleInputSchema},
  output: {schema: RelatedArticleOutputSchema},
  prompt: `You are a helpful assistant that suggests articles and blog posts related to a particular property or location.

  Based on the following query, find 3 related articles and blog posts.
  Query: {{{query}}}

  Format the output as a JSON object with an array of articles. Each article should have a title, url, and summary.
  `,
});

const relatedArticleGeneratorFlow = ai.defineFlow(
  {
    name: 'relatedArticleGeneratorFlow',
    inputSchema: RelatedArticleInputSchema,
    outputSchema: RelatedArticleOutputSchema,
  },
  async input => {
    const {output} = await relatedArticlePrompt(input);
    return output!;
  }
);
