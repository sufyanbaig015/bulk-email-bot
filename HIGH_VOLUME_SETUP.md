# High Volume Email Setup (10,000+ emails/day)

## ⚠️ Important: You Need a Professional Email Service

**Gmail will NOT work for 10,000 emails/day!**
- Gmail Personal: ~500 emails/day limit
- Gmail Workspace: ~2,000 emails/day limit

You need a professional email service provider.

## Recommended Email Services for 10K+ emails/day

### 1. **SendGrid** (Recommended for beginners)
- **Free Tier**: 100 emails/day
- **Essentials Plan**: $19.95/month = 50,000 emails/month
- **Setup**: Easy, good documentation
- **SMTP Settings**:
  ```env
  SMTP_HOST=smtp.sendgrid.net
  SMTP_PORT=587
  SMTP_SECURE=false
  SMTP_USER=apikey
  SMTP_PASS=your-sendgrid-api-key
  ```

### 2. **AWS SES** (Best for cost)
- **Free Tier**: 62,000 emails/month (first year)
- **Pricing**: $0.10 per 1,000 emails after free tier
- **10,000 emails/day = ~$30/month**
- **Setup**: More complex, requires AWS account
- **SMTP Settings**: Use your SES SMTP endpoint

### 3. **Mailgun**
- **Foundation Plan**: $35/month = 50,000 emails/month
- **SMTP Settings**: Use Mailgun SMTP endpoint

### 4. **Postmark**
- **10,000 emails**: $10/month
- **Good for transactional emails**

## Configuration for 10,000 emails/day

### Step 1: Update `.env` file

```env
# SMTP Configuration (Use SendGrid, AWS SES, or Mailgun)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-api-key-here

# High Volume Settings
MAX_BULK_EMAILS=10000
EMAIL_DELAY_MS=50

# Application Settings
NODE_ENV=production
LOG_LEVEL=info
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=Your Company Name
```

### Step 2: Optimize for High Volume

The app is already configured with:
- ✅ 50ms delay between emails (configurable)
- ✅ Automatic pauses every 100 emails for large batches
- ✅ Support for up to 10,000 emails per batch
- ✅ Comprehensive logging

### Step 3: Sending Strategy

**Option A: Single Large Batch (10,000 emails)**
- Time: ~8-10 minutes
- Best for: One-time campaigns
- Risk: Higher chance of timeout

**Option B: Split into Batches (Recommended)**
- Split CSV into 2,000-5,000 email batches
- Send multiple batches throughout the day
- More reliable, less risk of timeouts

**Option C: Scheduled Sending**
- Send 1,000-2,000 emails every 2-3 hours
- Spreads load throughout the day
- Best for daily campaigns

## Time Estimates

With 50ms delay (high-volume setting):
- **1,000 emails**: ~50 seconds
- **5,000 emails**: ~4 minutes
- **10,000 emails**: ~8-10 minutes

## Best Practices for 10K+ emails/day

### 1. **Domain Authentication**
- Set up SPF, DKIM, and DMARC records
- Use a dedicated sending domain
- Improves deliverability

### 2. **Email Content**
- Avoid spam trigger words
- Include unsubscribe link (required by law)
- Use proper HTML structure
- Test emails before sending

### 3. **List Management**
- Remove invalid/bounce emails
- Honor unsubscribe requests
- Keep bounce rate < 5%
- Keep spam complaints < 0.1%

### 4. **Monitoring**
- Check Email Logs tab regularly
- Monitor bounce rates
- Track open rates (if using tracking)
- Watch for rate limiting errors

### 5. **Rate Limiting**
- Don't send all 10K at once if possible
- Spread sends throughout the day
- Respect provider limits

## Example: Sending 10,000 emails

### Method 1: Single Batch
1. Prepare CSV with 10,000 emails
2. Upload to Bulk Email tab
3. Wait ~8-10 minutes
4. Check results

### Method 2: Split Batches (Recommended)
1. Split CSV into 5 files of 2,000 emails each
2. Send first batch: 2,000 emails (~2 minutes)
3. Wait 30 minutes
4. Send second batch: 2,000 emails
5. Repeat throughout the day

### Method 3: Automated (Future Enhancement)
- Implement queue system
- Background job processing
- Automatic retry on failures
- Progress tracking

## Troubleshooting High Volume

### Issue: Timeout Errors
**Solution**: Split into smaller batches (2,000-3,000 emails)

### Issue: Rate Limiting
**Solution**: 
- Increase `EMAIL_DELAY_MS` to 100-200
- Send in smaller batches
- Spread throughout the day

### Issue: High Bounce Rate
**Solution**:
- Clean your email list
- Remove invalid emails
- Verify email addresses before sending

### Issue: Emails Going to Spam
**Solution**:
- Set up SPF/DKIM records
- Use professional email service
- Improve email content
- Warm up your sending domain

## Cost Estimates

### SendGrid
- **50,000 emails/month**: $19.95/month
- **100,000 emails/month**: $89.95/month

### AWS SES
- **First 62,000/month**: FREE (first year)
- **After**: $0.10 per 1,000 emails
- **10,000/day = 300,000/month = ~$30/month**

### Mailgun
- **50,000 emails/month**: $35/month
- **100,000 emails/month**: $80/month

## Next Steps

1. **Choose an email service** (SendGrid recommended for ease)
2. **Set up account and get SMTP credentials**
3. **Update `.env` file with new credentials**
4. **Test with small batch (100 emails)**
5. **Gradually increase to full volume**
6. **Monitor logs and adjust as needed**

## Need Help?

- Check Email Logs tab for detailed error messages
- Review provider documentation for specific limits
- Test with small batches first
- Monitor bounce and complaint rates

