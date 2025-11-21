import { NextRequest, NextResponse } from 'next/server';
import emailService from '@/lib/email';
import logger from '@/lib/logger';
import { parseCSV, generateEmailContent, generateSubject } from '@/lib/csvParser';
import { EmailData } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const csvFile = formData.get('csv') as File;
    const subjectTemplate = formData.get('subject') as string;
    const htmlTemplate = formData.get('html') as string;
    const textTemplate = formData.get('text') as string;

    if (!csvFile || !subjectTemplate || !htmlTemplate) {
      return NextResponse.json(
        { error: 'Missing required fields: csv, subject, html' },
        { status: 400 }
      );
    }

    const csvContent = await csvFile.text();
    const recipients = parseCSV(csvContent);

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: 'No valid email addresses found in CSV' },
        { status: 400 }
      );
    }

    const maxEmails = parseInt(process.env.MAX_BULK_EMAILS || '10000');
    if (recipients.length > maxEmails) {
      return NextResponse.json(
        { 
          error: `Too many emails. Maximum allowed: ${maxEmails}. Your CSV contains: ${recipients.length}`,
          maxAllowed: maxEmails,
          received: recipients.length
        },
        { status: 400 }
      );
    }

    if (recipients.length > 5000) {
      logger.warn('Large batch detected', {
        count: recipients.length,
        suggestion: 'Consider splitting into smaller batches for better reliability'
      });
    }

    const emails: EmailData[] = recipients.map((recipient) => ({
      to: recipient.email,
      subject: generateSubject(subjectTemplate, recipient),
      html: generateEmailContent(htmlTemplate, recipient),
      text: textTemplate ? generateEmailContent(textTemplate, recipient) : undefined,
    }));

    const result = await emailService.sendBulkEmails(emails);

    logger.info('Bulk email API completed', {
      total: emails.length,
      success: result.success,
      failed: result.failed,
    });

    return NextResponse.json({
      success: true,
      total: emails.length,
      sent: result.success,
      failed: result.failed,
      results: result.results,
    });
  } catch (error: any) {
    logger.error('API error in bulk email', { error: error.message });
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

