# Email Sending Limits Guide

## Current Implementation

### Technical Limits
- **No hard limit in code** - You can send as many emails as you have in your CSV
- **Default maximum**: 10,000 emails per bulk send (configurable)
- **Rate limiting**: 100ms delay between emails (200ms for batches > 1000)

### How to Change the Limit

Add to your `.env` file:
```env
MAX_BULK_EMAILS=5000
```

Or remove the limit entirely by setting a very high number:
```env
MAX_BULK_EMAILS=100000
```

## SMTP Provider Limits

### Gmail (Personal)
- **Daily limit**: ~500 emails per day
- **Rate limit**: ~100 emails per hour
- **Recommendation**: Keep batches under 100-200 emails per send

### Gmail (Google Workspace)
- **Daily limit**: ~2,000 emails per day
- **Rate limit**: Higher than personal accounts
- **Recommendation**: Batches of 500-1000 emails work well

### Other Providers
- **SendGrid**: 100 emails/day (free), 40,000/day (paid)
- **AWS SES**: 200 emails/day (sandbox), unlimited (production)
- **Mailgun**: 5,000 emails/month (free), unlimited (paid)
- **Outlook/Hotmail**: ~300 emails/day

## Practical Recommendations

### For Small Batches (< 100 emails)
- ✅ Safe to send all at once
- ✅ 100ms delay is sufficient
- ✅ Should complete in ~10-30 seconds

### For Medium Batches (100-500 emails)
- ✅ Can send in one batch
- ✅ May take 1-5 minutes
- ⚠️ Monitor for rate limiting
- ⚠️ Check SMTP provider limits

### For Large Batches (500-2000 emails)
- ⚠️ May take 5-20 minutes
- ⚠️ Browser may timeout (consider background processing)
- ⚠️ Risk of hitting SMTP rate limits
- 💡 Consider splitting into smaller batches

### For Very Large Batches (> 2000 emails)
- ❌ Not recommended for single batch
- ❌ High risk of timeouts and rate limiting
- 💡 Split into multiple CSV files
- 💡 Use professional email service (SendGrid, AWS SES, etc.)
- 💡 Consider implementing queue system

## Time Estimates

Based on 100ms delay per email:
- **100 emails**: ~10 seconds
- **500 emails**: ~50 seconds
- **1,000 emails**: ~1.5 minutes
- **5,000 emails**: ~8 minutes
- **10,000 emails**: ~16 minutes

## Best Practices

1. **Start Small**: Test with 10-20 emails first
2. **Monitor Logs**: Check the Email Logs tab for errors
3. **Respect Limits**: Don't exceed your SMTP provider's daily limits
4. **Split Large Lists**: Break large lists into smaller batches
5. **Use Professional Services**: For > 1000 emails, consider SendGrid/AWS SES
6. **Check Spam**: Monitor spam rates and adjust content if needed

## Current Settings

- **Delay between emails**: 100ms (200ms for > 1000 emails)
- **Maximum batch size**: 10,000 (configurable via `MAX_BULK_EMAILS`)
- **Sequential sending**: Emails sent one at a time (not parallel)

## Future Improvements

Consider implementing:
- Background job processing for large batches
- Parallel sending (with rate limiting)
- Automatic batch splitting
- Progress tracking UI
- Queue system for very large lists

