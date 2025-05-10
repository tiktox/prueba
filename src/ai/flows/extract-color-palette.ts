// extract-color-palette.ts
'use server';

/**
 * @fileOverview An AI agent that extracts a color palette from an image.
 *
 * - extractColorPalette - A function that handles the color palette extraction process.
 * - ExtractColorPaletteInput - The input type for the extractColorPalette function.
 * - ExtractColorPaletteOutput - The return type for the extractColorPalette function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractColorPaletteInputSchema = z.object({
  imageUri: z
    .string()
    .describe(
      "A photo of a branding asset, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractColorPaletteInput = z.infer<typeof ExtractColorPaletteInputSchema>;

const ExtractColorPaletteOutputSchema = z.object({
  colors: z
    .array(z.string())
    .describe('An array of hex color codes extracted from the image.'),
});
export type ExtractColorPaletteOutput = z.infer<typeof ExtractColorPaletteOutputSchema>;

export async function extractColorPalette(input: ExtractColorPaletteInput): Promise<ExtractColorPaletteOutput> {
  return extractColorPaletteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractColorPalettePrompt',
  input: {schema: ExtractColorPaletteInputSchema},
  output: {schema: ExtractColorPaletteOutputSchema},
  prompt: `You are an expert color palette extractor.

You will analyze the image provided and extract the dominant colors, returning them as a JSON array of hex color codes. Only return a JSON array of hex color codes.

Image: {{media url=imageUri}}`,
});

const extractColorPaletteFlow = ai.defineFlow(
  {
    name: 'extractColorPaletteFlow',
    inputSchema: ExtractColorPaletteInputSchema,
    outputSchema: ExtractColorPaletteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
