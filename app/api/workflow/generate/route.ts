/**
 * POST /api/workflow/generate
 * Generate workflow steps using AI based on user input
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateWorkflowSteps } from '@/lib/groq';
import { AIResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { userInput, context } = await request.json();

    if (!userInput || userInput.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'User input is required',
        } as AIResponse,
        { status: 400 }
      );
    }

    const result = await generateWorkflowSteps(userInput, context);

    // Parse the AI response
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to generate workflow structure',
        } as AIResponse,
        { status: 400 }
      );
    }

    const workflowStructure = JSON.parse(jsonMatch[0]);

    return NextResponse.json(
      {
        success: true,
        data: workflowStructure,
        message: 'Workflow generated successfully',
      } as AIResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error('Workflow generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate workflow',
        message: error instanceof Error ? error.message : 'Unknown error',
      } as AIResponse,
      { status: 500 }
    );
  }
}
