'use server';

/**
 * @fileOverview An AI agent for uploading images to a free hosting service.
 *
 * - uploadImage - A function that uploads an image and returns a public URL.
 * - UploadImageInput - The input type for the uploadImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const UploadImageInputSchema = z.object({
    imageDataUrl: z
    .string()
    .describe(
      "A photo as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export type UploadImageInput = z.infer<typeof UploadImageInputSchema>;

export async function uploadImage(input: UploadImageInput): Promise<string> {
  const result = await imageUploaderFlow(input);
  return result.imageUrl;
}

const imageUploaderFlow = ai.defineFlow(
  {
    name: 'imageUploaderFlow',
    inputSchema: UploadImageInputSchema,
    outputSchema: z.object({ imageUrl: z.string() }),
  },
  async (input) => {
    // This is a simplified example of calling an external API.
    // In a real application, you would use a more robust HTTP client
    // and handle potential errors gracefully.
    const apiUrl = 'https://api.postimages.org/1/upload';
    const apiKey = '1410459b7362a15f187d26b864a78733'; // This is a public key for guest uploads.

    // The Postimages API expects the image data in a multipart/form-data request.
    // We'll simulate this using a FormData object.
    const formData = new FormData();
    formData.append('key', apiKey);
    formData.append('image', input.imageDataUrl);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();

      if (result.status !== 'success') {
          throw new Error(`Image upload failed: ${result.error?.message || 'Unknown error'}`);
      }

      return {
        imageUrl: result.data.url,
      };

    } catch (error) {
      console.error("Error uploading image:", error);
      // It's important to re-throw the error or handle it so the caller knows the upload failed.
      throw new Error('Failed to upload image to hosting service.');
    }
  }
);
