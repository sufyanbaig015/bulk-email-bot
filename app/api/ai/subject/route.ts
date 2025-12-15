import { NextRequest, NextResponse } from 'next/server';
import { generateSubjectLines } from '@/lib/ai';
import logger from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emailContent, count } = body;

    if (!emailContent) {
      return NextResponse.json({ error: 'Email content is required' }, { status: 400 });
    }

    const subjectLines = await generateSubjectLines(emailContent, count || 3);

    logger.info('AI subject lines generated', { count: subjectLines.length });

    return NextResponse.json({ success: true, subjectLines });
  } catch (error: any) {
    logger.error('AI subject generation error', { error: error.message });
    return NextResponse.json(
      { error: 'Failed to generate subject lines', message: error.message },
      { status: 500 }
    );
  }
}

