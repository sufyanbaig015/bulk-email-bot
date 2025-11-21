# Bulk Email Sender (SMTP-Only)

A lightweight Next.js application for sending single or bulk emails using any SMTP provider. No database, authentication, or Prisma setup required—just provide SMTP credentials and start sending.

## Features

- ✅ **Single Email Sending**: Send individual emails with HTML and plain text support
- ✅ **Bulk Email Sending**: Upload CSV files and send personalized emails to multiple recipients
- ✅ **CSV Template Support**: Use placeholders like `{{name}}`, `{{email}}`, and custom fields
- ✅ **SMTP Integration**: Configure any SMTP server (Gmail, SendGrid, AWS SES, etc.)
- ✅ **Comprehensive Logging**: Track all email activities with Winston logger
- ✅ **Connection Status**: Real-time SMTP connection verification
- ✅ **Email Logs Viewer**: View and filter email logs by type
- ✅ **Zero Auth/DB**: No signup or database dependencies—configure SMTP and go
- ✅ **Modern UI**: Beautiful, responsive interface built with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Email**: Nodemailer
- **CSV Parsing**: PapaParse
- **Logging**: Winston
- **Date Formatting**: date-fns

## Prerequisites

- Node.js 18+ and npm/yarn
- SMTP server credentials (Gmail, SendGrid, AWS SES, etc.)

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd Email
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Configure your SMTP settings in `.env`:**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   FROM_EMAIL=your-email@gmail.com
   FROM_NAME=Bulk Email Sender
   NODE_ENV=development
   LOG_LEVEL=info
   ```

### Gmail Setup

If using Gmail, you'll need to:
1. Enable 2-Step Verification on your Google account
2. Generate an App Password: [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Use the app password in `SMTP_PASS`

### Other SMTP Providers

- **SendGrid**: Use `smtp.sendgrid.net`, port `587`
- **AWS SES**: Use your SES SMTP endpoint, port `587`
- **Outlook**: Use `smtp-mail.outlook.com`, port `587`
- **Custom SMTP**: Configure according to your provider's settings

## Running the Application

1. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## Usage

### Single Email

1. Navigate to the "Single Email" tab
2. Fill in the recipient email, subject, and HTML content
3. Optionally add CC, BCC, and plain text content
4. Click "Send Email"

### Bulk Email (CSV)

1. **Prepare your CSV file:**
   - Required column: `email`
   - Optional columns: `name`, `subject`, and any custom fields
   - See `sample.csv` for an example

2. **Navigate to the "Bulk Email (CSV)" tab**

3. **Upload your CSV file**

4. **Create email templates:**
   - Subject Template: Use placeholders like `{{name}}`, `{{email}}`, or `{{customField}}`
   - HTML Template: Use the same placeholders for personalized content
   - Plain Text Template (optional): Plain text version of your email

5. **Click "Send Bulk Emails"**

### CSV Format Example

```csv
email,name,company,position
john@example.com,John Doe,Acme Corp,Manager
jane@example.com,Jane Smith,Tech Inc,Developer
```

### Template Placeholders

- `{{email}}` - Recipient email address
- `{{name}}` - Recipient name (or "Valued Customer" if not provided)
- `{{yourColumnName}}` - Any custom column from your CSV

Example HTML template:
```html
<h1>Hello {{name}}!</h1>
<p>Thank you for your interest in {{company}}.</p>
<p>We look forward to working with you as a {{position}}.</p>
```

### Email Logs

1. Navigate to the "Email Logs" tab
2. Select log type (Email Logs, Error Logs, or All Logs)
3. Adjust the limit to see more/fewer entries
4. Click "Refresh" to update the logs

## Project Structure

```
Email/
├── app/
│   ├── api/
│   │   ├── email/
│   │   │   ├── send/route.ts      # Single email API
│   │   │   ├── bulk/route.ts       # Bulk email API
│   │   │   └── verify/route.ts     # SMTP verification API
│   │   └── logs/route.ts           # Logs retrieval API
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Main page
├── components/
│   ├── ConnectionStatus.tsx        # SMTP connection status
│   ├── EmailForm.tsx               # Single email form
│   ├── BulkEmailUpload.tsx         # Bulk email upload form
│   └── EmailLogs.tsx               # Email logs viewer
├── lib/
│   ├── email.ts                    # Email service (Nodemailer)
│   ├── logger.ts                    # Winston logger
│   └── csvParser.ts                # CSV parsing utilities
├── logs/                           # Log files (auto-generated)
├── .env.example                    # Environment variables template
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
├── next.config.js                  # Next.js config
└── README.md                       # This file
```

## Logging

The application uses Winston for comprehensive logging:

- **combined.log**: All application logs
- **error.log**: Error logs only
- **emails.log**: Email-specific logs (sent, failed, etc.)

Logs are stored in the `logs/` directory and automatically rotated when they reach 5MB.

## API Endpoints

### POST `/api/email/send`
Send a single email.

**Request Body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "html": "<h1>Hello</h1>",
  "text": "Hello",
  "cc": ["cc@example.com"],
  "bcc": ["bcc@example.com"]
}
```

### POST `/api/email/bulk`
Send bulk emails from CSV.

**Form Data:**
- `csv`: CSV file
- `subject`: Subject template
- `html`: HTML template
- `text`: Plain text template (optional)

### GET `/api/email/verify`
Verify SMTP connection.

### GET `/api/logs?type=emails&limit=100`
Retrieve email logs.

## Security Considerations

- Never commit `.env` files to version control
- Use app passwords instead of regular passwords for Gmail
- Throttle requests in production if exposing the API publicly
- Validate and sanitize all user inputs (especially CSV content)
- Run behind HTTPS in production

## Troubleshooting

### SMTP Connection Failed
- Verify your SMTP credentials in `.env`
- Check if your SMTP server requires specific ports
- For Gmail, ensure you're using an App Password, not your regular password
- Check firewall settings

### Emails Not Sending
- Check the Email Logs tab for error messages
- Verify SMTP connection status
- Ensure recipient email addresses are valid
- Check spam folder

### CSV Parsing Errors
- Ensure CSV has proper headers
- Check that `email` column exists
- Verify CSV file format (comma-separated)
- Check for special characters in CSV

## License

MIT

## Support

For issues or questions, please check the logs in the `logs/` directory or the Email Logs tab in the application.

