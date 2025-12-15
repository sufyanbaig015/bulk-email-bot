import { NextRequest, NextResponse } from 'next/server';
import { generateEmailContent, GenerateEmailOptions } from '@/lib/ai';
import logger from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, tone, length, recipient, format } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const options: GenerateEmailOptions = {
      prompt,
      tone: tone || 'professional',
      length: length || 'medium',
      recipient,
      format: format || 'html',
    };

    const content = await generateEmailContent(options);

    logger.info('AI email generated', { tone, length, promptLength: prompt.length });

    return NextResponse.json({ success: true, content });
  } catch (error: any) {
    logger.error('AI generation error', { error: error.message });
    return NextResponse.json(
      { error: 'Failed to generate email', message: error.message },
      { status: 500 }
    );
  }
}

