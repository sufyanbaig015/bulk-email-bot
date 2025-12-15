import { NextRequest, NextResponse } from 'next/server';
import { chatWithAI } from '@/lib/ai';
import logger from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const response = await chatWithAI(message, conversationHistory || []);

    logger.info('AI chat response generated', { messageLength: message.length });

    return NextResponse.json({ 
      success: true, 
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    logger.error('AI chat error', { error: error.message });
    return NextResponse.json(
      { error: 'Failed to get chat response', message: error.message },
      { status: 500 }
    );
  }
}

