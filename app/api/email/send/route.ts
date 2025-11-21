import { NextRequest, NextResponse } from 'next/server';
import emailService from '@/lib/email';
import logger from '@/lib/logger';
import { EmailData } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, html, text, cc, bcc } = body;

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, html' },
        { status: 400 }
      );
    }

    const emailData: EmailData = {
      to,
      subject,
      html,
      text,
      cc,
      bcc,
    };

    const result = await emailService.sendEmail(emailData);

    if (result.success) {
      logger.info('Single email sent', {
        to,
        subject,
        messageId: result.messageId,
      });

      return NextResponse.json({
        success: true,
        messageId: result.messageId,
      });
    }

    logger.error('Single email failed', {
      to,
      subject,
      error: result.error,
    });

    return NextResponse.json(
      { error: result.error || 'Failed to send email' },
      { status: 500 }
    );
  } catch (error: any) {
    logger.error('API error in send email', { error: error.message });
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

