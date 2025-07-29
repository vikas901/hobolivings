'use server';

/**
 * @fileOverview An FAQ chatbot for answering student questions about property details.
 *
 * - askFaqChatbot - A function that handles the FAQ chatbot process.
 * - AskFaqChatbotInput - The input type for the askFaqChatbot function.
 * - AskFaqChatbotOutput - The return type for the askFaqChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AskFaqChatbotInputSchema = z.object({
  question: z.string().describe('The question the student is asking about the property.'),
  propertyDetails: z
    .string()
    .describe('Detailed information about the property, including amenities, pricing, and location.'),
});
export type AskFaqChatbotInput = z.infer<typeof AskFaqChatbotInputSchema>;

const AskFaqChatbotOutputSchema = z.object({
  answer: z.string().describe('The chatbot answer to the student question.'),
});
export type AskFaqChatbotOutput = z.infer<typeof AskFaqChatbotOutputSchema>;

export async function askFaqChatbot(input: AskFaqChatbotInput): Promise<AskFaqChatbotOutput> {
  return askFaqChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askFaqChatbotPrompt',
  input: {schema: AskFaqChatbotInputSchema},
  output: {schema: AskFaqChatbotOutputSchema},
  prompt: `You are a chatbot answering questions about a property.

  You have access to the following information about the property:
  {{propertyDetails}}

  Answer the following question:
  {{question}}

  Keep your answer concise and to the point.
  `,
});

const askFaqChatbotFlow = ai.defineFlow(
  {
    name: 'askFaqChatbotFlow',
    inputSchema: AskFaqChatbotInputSchema,
    outputSchema: AskFaqChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
