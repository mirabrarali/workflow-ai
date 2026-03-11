/**
 * POST /api/chat
 * Chat with AI assistant
 */

import { NextRequest, NextResponse } from 'next/server';
import { chatWithAI } from '@/lib/groq';
import { AIResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Message is required',
        } as AIResponse,
        { status: 400 }
      );
    }

    const response = await chatWithAI(message, history);

    return NextResponse.json(
      {
        success: true,
        data: {
          message: response,
          timestamp: new Date().toISOString(),
        },
        message: 'Message processed successfully',
      } as AIResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process message',
        message: error instanceof Error ? error.message : 'Unknown error',
      } as AIResponse,
      { status: 500 }
    );
  }
}
