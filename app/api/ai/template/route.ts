import { NextRequest, NextResponse } from 'next/server';
import { generateBulkTemplate } from '@/lib/ai';
import logger from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaignDescription, csvColumns } = body;

    if (!campaignDescription) {
      return NextResponse.json(
        { error: 'Campaign description is required' },
        { status: 400 }
      );
    }

    const template = await generateBulkTemplate(
      campaignDescription,
      csvColumns || ['email', 'name']
    );

    logger.info('AI bulk template generated', {
      hasSubject: !!template.subject,
      hasHtml: !!template.html,
    });

    return NextResponse.json({ success: true, template });
  } catch (error: any) {
    logger.error('AI template generation error', { error: error.message });
    return NextResponse.json(
      { error: 'Failed to generate template', message: error.message },
      { status: 500 }
    );
  }
}

