import { NextRequest, NextResponse } from 'next/server';
import { improveEmailContent, ImproveEmailOptions } from '@/lib/ai';
import logger from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, improvement, targetTone } = body;

    if (!content) {
      return NextResponse.json({ error: 'Email content is required' }, { status: 400 });
    }

    const options: ImproveEmailOptions = {
      content,
      improvement: improvement || 'clarity',
      targetTone,
    };

    const improvedContent = await improveEmailContent(options);

    logger.info('AI email improved', { improvement, hasTargetTone: !!targetTone });

    return NextResponse.json({ success: true, content: improvedContent });
  } catch (error: any) {
    logger.error('AI improvement error', { error: error.message });
    return NextResponse.json(
      { error: 'Failed to improve email', message: error.message },
      { status: 500 }
    );
  }
}

