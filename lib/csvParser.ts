import Papa from 'papaparse';
import logger from './logger';
import { EmailData } from './email';

interface CSVRow {
  [key: string]: string;
}

interface ParsedEmail {
  email: string;
  name?: string;
  subject?: string;
  customFields?: { [key: string]: string };
}

export function parseCSV(csvContent: string): ParsedEmail[] {
  try {
    const result = Papa.parse<CSVRow>(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase(),
    });

    if (result.errors.length > 0) {
      logger.warn('CSV parsing warnings', { errors: result.errors });
    }

    const emails: ParsedEmail[] = result.data.map((row) => {
      const email: ParsedEmail = {
        email: row.email || row.e || row['email address'] || '',
        name: row.name || row['full name'] || row['first name'] || '',
        subject: row.subject || '',
        customFields: {},
      };

      // Extract all other fields as custom fields
      Object.keys(row).forEach((key) => {
        if (!['email', 'e', 'email address', 'name', 'full name', 'first name', 'subject'].includes(key)) {
          email.customFields![key] = row[key];
        }
      });

      return email;
    });

    // Filter out rows without email addresses
    const validEmails = emails.filter((e) => e.email && isValidEmail(e.email));

    logger.info('CSV parsed successfully', {
      total: result.data.length,
      valid: validEmails.length,
      invalid: result.data.length - validEmails.length,
    });

    return validEmails;
  } catch (error: any) {
    logger.error('Failed to parse CSV', { error: error.message });
    throw new Error(`CSV parsing failed: ${error.message}`);
  }
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function generateEmailContent(
  template: string,
  recipient: ParsedEmail
): string {
  let content = template;

  // Replace placeholders
  content = content.replace(/\{\{email\}\}/g, recipient.email);
  content = content.replace(/\{\{name\}\}/g, recipient.name || 'Valued Customer');

  // Replace custom field placeholders
  if (recipient.customFields) {
    Object.keys(recipient.customFields).forEach((key) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      content = content.replace(regex, recipient.customFields![key]);
    });
  }

  return content;
}

export function generateSubject(
  template: string,
  recipient: ParsedEmail
): string {
  let subject = template;

  // Replace placeholders
  subject = subject.replace(/\{\{email\}\}/g, recipient.email);
  subject = subject.replace(/\{\{name\}\}/g, recipient.name || 'Valued Customer');

  // Replace custom field placeholders
  if (recipient.customFields) {
    Object.keys(recipient.customFields).forEach((key) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      subject = subject.replace(regex, recipient.customFields![key]);
    });
  }

  return subject;
}

