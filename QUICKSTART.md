# Quick Start Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Configure Environment

Copy `.env.example` to `.env` and fill in your SMTP credentials:

```bash
cp .env.example .env
```

Edit `.env` with your SMTP settings:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com
FROM_NAME=Bulk Email Sender
```

## 3. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 4. Test the Connection

1. Click on the "Connection Status" section
2. Click "Refresh" to verify SMTP connection
3. If connected, you're ready to send emails!

## 5. Send Your First Email

### Single Email:
- Go to "Single Email" tab
- Fill in recipient, subject, and HTML content
- Click "Send Email"

### Bulk Email:
- Go to "Bulk Email (CSV)" tab
- Upload a CSV file (see `sample.csv` for format)
- Create templates with placeholders like `{{name}}`, `{{email}}`
- Click "Send Bulk Emails"

## CSV Format

Your CSV should have at least an `email` column:

```csv
email,name,company
john@example.com,John Doe,Acme Corp
jane@example.com,Jane Smith,Tech Inc
```

## Template Placeholders

- `{{email}}` - Recipient email
- `{{name}}` - Recipient name
- `{{anyColumnName}}` - Any CSV column

Example:
```
Subject: Hello {{name}}!
HTML: <h1>Hi {{name}}!</h1><p>Your email is {{email}}</p>
```

## View Logs

Go to "Email Logs" tab to see all email activities, errors, and status.

## Troubleshooting

- **Connection Failed**: Check your SMTP credentials in `.env`
- **Gmail Issues**: Use App Password, not regular password
- **CSV Errors**: Ensure CSV has `email` column and proper format
- **Check Logs**: View detailed errors in "Email Logs" tab

For more details, see `README.md`.

