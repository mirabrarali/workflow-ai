/**
 * POST /api/pdf/analyze
 * Analyze document content using AI
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyzeDocument } from '@/lib/groq';
import { AIResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { documentContent, analysisType = 'summary' } =
      await request.json();

    if (!documentContent || documentContent.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Document content is required',
        } as AIResponse,
        { status: 400 }
      );
    }

    // Limit document size for API calls
    const truncatedContent = documentContent.substring(0, 5000);

    const result = await analyzeDocument(
      truncatedContent,
      analysisType as 'summary' | 'extract' | 'categorize'
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          analysis: result,
          type: analysisType,
          timestamp: new Date().toISOString(),
        },
        message: 'Document analyzed successfully',
      } as AIResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error('Document analysis error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to analyze document',
        message: error instanceof Error ? error.message : 'Unknown error',
      } as AIResponse,
      { status: 500 }
    );
  }
}
