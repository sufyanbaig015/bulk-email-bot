import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface GenerateEmailOptions {
  prompt: string;
  tone?: 'professional' | 'casual' | 'friendly' | 'formal' | 'persuasive';
  length?: 'short' | 'medium' | 'long';
  recipient?: string;
  format?: 'html' | 'plain';
}

export interface ImproveEmailOptions {
  content: string;
  improvement?: 'grammar' | 'clarity' | 'tone' | 'persuasiveness' | 'brevity';
  targetTone?: 'professional' | 'casual' | 'friendly' | 'formal' | 'persuasive';
}

/**
 * Generate email content based on a prompt
 */
export async function generateEmailContent(options: GenerateEmailOptions): Promise<string> {
  const { prompt, tone = 'professional', length = 'medium', recipient, format = 'html' } = options;

  const toneDescription = {
    professional: 'professional and business-like',
    casual: 'casual and relaxed',
    friendly: 'warm and friendly',
    formal: 'formal and respectful',
    persuasive: 'persuasive and compelling',
  }[tone];

  const lengthDescription = {
    short: '2-3 sentences',
    medium: '1-2 paragraphs',
    long: '3-4 paragraphs',
  }[length];

  let systemPrompt: string;
  let userPrompt: string;

  if (format === 'plain') {
    systemPrompt = `You are an expert email writer. Generate clean, readable plain text email content.
The email should be ${toneDescription} in tone and approximately ${lengthDescription} in length.
Return only the plain text email content without any HTML tags, markdown, or formatting. Just the text.`;

    userPrompt = recipient
      ? `Write a plain text email${tone ? ` in a ${toneDescription} tone` : ''} about: ${prompt}\n\nRecipient: ${recipient}\n\nReturn only plain text, no HTML, no formatting.`
      : `Write a plain text email${tone ? ` in a ${toneDescription} tone` : ''} about: ${prompt}\n\nReturn only plain text, no HTML, no formatting.`;
  } else {
    systemPrompt = `You are an expert email writer. Generate clean, simple HTML email content.
IMPORTANT: 
- Use ONLY simple HTML tags like <p>, <h1>, <h2>, <strong>, <em>, <br>, <a>
- Do NOT include DOCTYPE, <html>, <head>, <body>, or <style> tags
- Do NOT include inline styles or complex formatting
- Keep it simple and readable - just the email body content
The email should be ${toneDescription} in tone and approximately ${lengthDescription} in length.
Return only the simple HTML body content without any explanations, markdown, or full HTML document structure.`;

    userPrompt = recipient
      ? `Write a simple email${tone ? ` in a ${toneDescription} tone` : ''} about: ${prompt}\n\nRecipient: ${recipient}\n\nUse only simple HTML tags like <p>, <h2>, <strong>. No styles, no full HTML structure.`
      : `Write a simple email${tone ? ` in a ${toneDescription} tone` : ''} about: ${prompt}\n\nUse only simple HTML tags like <p>, <h2>, <strong>. No styles, no full HTML structure.`;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    let content = completion.choices[0]?.message?.content || '';
    // Clean up the response - remove markdown code blocks if present
    content = content.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Remove full HTML document structure if present
    content = content.replace(/<!DOCTYPE[^>]*>/gi, '');
    content = content.replace(/<html[^>]*>/gi, '');
    content = content.replace(/<\/html>/gi, '');
    content = content.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '');
    content = content.replace(/<body[^>]*>/gi, '');
    content = content.replace(/<\/body>/gi, '');
    
    // Remove style tags and their content
    content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    
    // Clean up extra whitespace
    content = content.trim();
    
    return content;
  } catch (error: any) {
    throw new Error(`Failed to generate email: ${error.message}`);
  }
}

/**
 * Generate subject line suggestions
 */
export async function generateSubjectLines(
  emailContent: string,
  count: number = 3
): Promise<string[]> {
  const systemPrompt = `You are an expert email marketer. Generate compelling, concise subject lines for emails.
Return only the subject lines, one per line, without numbering or bullet points.`;

  const userPrompt = `Generate ${count} subject line options for this email content:\n\n${emailContent}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 200,
    });

    const content = completion.choices[0]?.message?.content || '';
    // Split by newlines and clean up
    return content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.match(/^\d+[\.\)]/))
      .slice(0, count);
  } catch (error: any) {
    throw new Error(`Failed to generate subject lines: ${error.message}`);
  }
}

/**
 * Improve existing email content
 */
export async function improveEmailContent(options: ImproveEmailOptions): Promise<string> {
  const { content, improvement = 'clarity', targetTone } = options;

  const improvementDescription = {
    grammar: 'fix grammar and spelling errors',
    clarity: 'improve clarity and readability',
    tone: targetTone ? `adjust the tone to be more ${targetTone}` : 'improve the overall tone',
    persuasiveness: 'make it more persuasive and compelling',
    brevity: 'make it more concise while keeping the key message',
  }[improvement];

  const systemPrompt = `You are an expert email editor. ${improvementDescription.charAt(0).toUpperCase() + improvementDescription.slice(1)}.
IMPORTANT: 
- Use ONLY simple HTML tags like <p>, <h1>, <h2>, <strong>, <em>, <br>, <a>
- Do NOT include DOCTYPE, <html>, <head>, <body>, or <style> tags
- Do NOT add inline styles or complex formatting
- Keep it simple and readable - just the email body content
Return only the improved simple HTML body content without any explanations, markdown, or full HTML document structure.`;

  const userPrompt = `Improve this email content (${improvementDescription}):\n\n${content}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.5,
      max_tokens: 1500,
    });

    let improvedContent = completion.choices[0]?.message?.content || '';
    // Clean up the response
    improvedContent = improvedContent.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Remove full HTML document structure if present
    improvedContent = improvedContent.replace(/<!DOCTYPE[^>]*>/gi, '');
    improvedContent = improvedContent.replace(/<html[^>]*>/gi, '');
    improvedContent = improvedContent.replace(/<\/html>/gi, '');
    improvedContent = improvedContent.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '');
    improvedContent = improvedContent.replace(/<body[^>]*>/gi, '');
    improvedContent = improvedContent.replace(/<\/body>/gi, '');
    improvedContent = improvedContent.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    
    return improvedContent.trim();
  } catch (error: any) {
    throw new Error(`Failed to improve email: ${error.message}`);
  }
}

/**
 * Generate email template for bulk campaigns
 */
export async function generateBulkTemplate(
  campaignDescription: string,
  csvColumns: string[] = ['email', 'name']
): Promise<{ subject: string; html: string }> {
  const systemPrompt = `You are an expert email marketer. Generate email templates for bulk campaigns.
The template should use placeholders like {{name}}, {{email}}, etc. for personalization.
IMPORTANT for HTML field:
- Use ONLY simple HTML tags like <p>, <h1>, <h2>, <strong>, <em>, <br>, <a>
- Do NOT include DOCTYPE, <html>, <head>, <body>, or <style> tags
- Do NOT include inline styles or complex formatting
- Keep it simple and readable - just the email body content
You must return ONLY a valid JSON object with "subject" and "html" fields. The HTML should be simple and professional.
Do not include any text before or after the JSON object.`;

  const columnsInfo = csvColumns.join(', ');
  const userPrompt = `Generate an email template for: ${campaignDescription}\n\nAvailable CSV columns: ${columnsInfo}\n\nUse placeholders like {{columnName}} in the template.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content || '';
    const parsed = JSON.parse(content);
    return {
      subject: parsed.subject || '',
      html: parsed.html || '',
    };
  } catch (error: any) {
    throw new Error(`Failed to generate template: ${error.message}`);
  }
}

/**
 * Chat with AI assistant for email-related help
 */
export async function chatWithAI(
  message: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<string> {
  const systemPrompt = `You are a friendly and helpful assistant for a bulk email application called BulkEmail Pro. 

This application helps users send emails through SMTP. Here's what it can do:

1. Single Email Sending - Users can send individual emails with HTML content
2. Bulk Email Sending - Users can upload CSV files and send personalized emails to multiple recipients using templates with placeholders like {{name}}, {{email}}, etc.
3. SMTP Configuration - Works with Gmail, SendGrid, AWS SES, Mailgun, and other SMTP providers
4. Email Logs - Users can view logs of sent emails, errors, and delivery status
5. AI Features - The app has AI tools to generate email content, improve emails, suggest subject lines, and generate bulk email templates

When users ask questions:
- Answer in a simple, conversational way like you're talking to a friend
- No special characters, bullet points, or fancy formatting - just plain natural text
- Be helpful and explain things clearly
- If they ask about how to use the app, guide them step by step
- If they ask about email writing, give practical advice
- Keep responses natural and human-like, not robotic

Remember: Keep it simple, friendly, and human. No lists with dashes or special formatting. Just talk naturally.`;

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...conversationHistory.slice(-8), // Keep last 8 messages for better context
    { role: 'user' as const, content: message },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.9, // Higher temperature for more natural, human-like responses
      max_tokens: 400, // Shorter responses for simplicity
    });

    let response = completion.choices[0]?.message?.content || 'Sorry, I could not understand that. Can you try asking again?';
    
    // Clean up any special formatting that might slip through
    response = response
      .replace(/^[-*•]\s+/gm, '') // Remove bullet points
      .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
      .replace(/^\d+\.\s+/gm, '') // Remove numbered lists
      .trim();

    return response;
  } catch (error: any) {
    throw new Error(`Failed to chat with AI: ${error.message}`);
  }
}

