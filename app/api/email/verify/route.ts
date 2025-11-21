import { NextRequest, NextResponse } from 'next/server';
import emailService from '@/lib/email';
import logger from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const isConnected = await emailService.verifyConnection();

    if (isConnected) {
      return NextResponse.json({
        success: true,
        message: 'SMTP connection verified successfully',
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'SMTP connection verification failed',
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    logger.error('API error in verify email', { error: error.message });
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

