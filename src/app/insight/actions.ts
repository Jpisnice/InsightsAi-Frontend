'use server';

import { revalidatePath } from 'next/cache';
import { currentUser } from '@clerk/nextjs/server';
import { Mistral } from '@mistralai/mistralai';

export async function processFile(file: File): Promise<Record<string, unknown>> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    // Replace with your actual API endpoint
    const response = await fetch('https://api.example.com/process-document', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error processing file:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to process file');
  }
}

// New: function to process file via Mistral's OCR endpoint
export async function processFileWithMistral(file: File): Promise<any> {
    const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });
    try {
        const ocrResponse = await client.ocr.process({
            model: "mistral-ocr-latest",
            document: {
                type: "document_url", // assuming file upload type
                documentUrl: "",
                documentName:file.name
            },
            includeImageBase64: true
        });
        return ocrResponse;
    } catch (error) {
        console.error('Error processing file via Mistral:', error);
        throw error;
    }
}