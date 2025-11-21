import nodemailer from 'nodemailer';
import logger from './logger';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromEmail: string;
  fromName: string;
}

interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
  cc?: string[];
  bcc?: string[];
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private config: EmailConfig;

  constructor() {
    this.config = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
      fromEmail: process.env.FROM_EMAIL || process.env.SMTP_USER || '',
      fromName: process.env.FROM_NAME || 'Bulk Email Sender',
    };

    this.initializeTransporter();
  }

  private initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransport({
        host: this.config.host,
        port: this.config.port,
        secure: this.config.secure,
        auth: {
          user: this.config.user,
          pass: this.config.pass,
        },
      });

      logger.info('Email transporter initialized', {
        host: this.config.host,
        port: this.config.port,
      });
    } catch (error) {
      logger.error('Failed to initialize email transporter', { error });
    }
  }

  async verifyConnection(): Promise<boolean> {
    if (!this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      logger.info('SMTP connection verified');
      return true;
    } catch (error) {
      logger.error('SMTP connection verification failed', { error });
      return false;
    }
  }

  async sendEmail(emailData: EmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.transporter) {
      const error = 'Email transporter not initialized';
      logger.error(error);
      return { success: false, error };
    }

    try {
      const mailOptions = {
        from: `"${this.config.fromName}" <${this.config.fromEmail}>`,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text || emailData.html.replace(/<[^>]*>/g, ''),
        cc: emailData.cc,
        bcc: emailData.bcc,
      };

      const info = await this.transporter.sendMail(mailOptions);

      logger.info('Email sent successfully', {
        messageId: info.messageId,
        to: emailData.to,
        subject: emailData.subject,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error: any) {
      logger.error('Failed to send email', {
        error: error.message,
        to: emailData.to,
        subject: emailData.subject,
      });

      return {
        success: false,
        error: error.message || 'Unknown error occurred',
      };
    }
  }

  async sendBulkEmails(
    emails: EmailData[],
    onProgress?: (sent: number, total: number, current: EmailData) => void
  ): Promise<{ success: number; failed: number; results: Array<{ email: string; success: boolean; error?: string }> }> {
    let successCount = 0;
    let failedCount = 0;
    const results: Array<{ email: string; success: boolean; error?: string }> = [];

    logger.info('Starting bulk email send', { total: emails.length });

    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      const result = await this.sendEmail(email);

      if (result.success) {
        successCount++;
      } else {
        failedCount++;
      }

      results.push({
        email: email.to,
        success: result.success,
        error: result.error,
      });

      if (onProgress) {
        onProgress(successCount + failedCount, emails.length, email);
      }

      // Add a delay to avoid overwhelming the SMTP server
      // Configurable delay via env (default: 50ms for high-volume, 100ms for normal)
      const baseDelay = parseInt(process.env.EMAIL_DELAY_MS || '50');
      const delay = emails.length > 5000 ? baseDelay : Math.max(baseDelay, 100);
      
      if (i < emails.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      
      // For very large batches, add periodic longer pauses to prevent rate limiting
      if (emails.length > 1000 && (i + 1) % 100 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    logger.info('Bulk email send completed', {
      total: emails.length,
      success: successCount,
      failed: failedCount,
    });

    return {
      success: successCount,
      failed: failedCount,
      results,
    };
  }
}

const emailService = new EmailService();

export default emailService;
export type { EmailData, EmailConfig };

