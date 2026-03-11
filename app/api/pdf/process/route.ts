/**
 * POST /api/pdf/process
 * Process uploaded PDF file and extract text
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const buffer = await request.arrayBuffer();

    // For POC, we'll use a simple approach
    // In production, you might want to use pdf-parse or similar
    try {
      const pdfText = await extractPDFText(buffer);

      return NextResponse.json(
        {
          success: true,
          text: pdfText,
          message: 'PDF processed successfully',
        },
        { status: 200 }
      );
    } catch (parseError) {
      // If PDF parsing fails, provide a generic message
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to extract text from PDF. Please try a different file.',
          message:
            'The PDF file could not be processed. Make sure it is a valid PDF.',
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('PDF processing error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while processing the PDF',
      },
      { status: 500 }
    );
  }
}

async function extractPDFText(buffer: ArrayBuffer): Promise<string> {
  // Dynamic import of pdf-parse for serverless compatibility
  const pdfParse = require('pdf-parse');

  const data = await pdfParse(Buffer.from(buffer));

  // Extract text from all pages
  let fullText = '';
  if (data.text) {
    fullText = data.text;
  } else if (data.version) {
    // Fallback method
    fullText = 'PDF processed but text extraction needs improvement';
  }

  return fullText;
}
