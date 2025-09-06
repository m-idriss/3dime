# Dead Link Checker Workflow

## Overview

The dead link checker is an automated GitHub Action that validates all external links in the 3dime website to ensure they remain accessible and functional.

## Features

- **Automated Scheduling**: Runs every Monday at 9 AM UTC
- **Manual Trigger**: Can be triggered manually via workflow dispatch
- **Comprehensive Checking**: Validates links in:
  - `structured-data.jsonld` - Social media, technology, and organization links
  - `index.html` - CDN resources and additional external links  
  - `README.md` - Documentation links
- **Issue Creation**: Automatically creates GitHub issues when dead links are found
- **Detailed Reporting**: Provides comprehensive reports in workflow summaries

## How It Works

1. **Link Extraction**: Uses [lychee](https://github.com/lycheeverse/lychee) to extract and validate links
2. **Status Validation**: Accepts HTTP status codes: 200-204, 300-308, 429 (rate limited)
3. **Retry Logic**: Implements retry mechanisms with wait times for temporary failures
4. **Caching**: Uses link caching to avoid redundant checks (24-hour cache)
5. **Reporting**: Creates detailed markdown reports with failure details

## Configuration

### Accepted Status Codes
- `200-204`: Success responses
- `300-308`: Redirect responses  
- `429`: Rate limited (considered valid for social media sites)

### Exclusions
- Email addresses (`mailto:` links)
- Private/local network addresses
- Link-local addresses

### User Agent
Uses a custom user agent: `Mozilla/5.0 (compatible; 3dime-link-checker/1.0)`

## Manual Execution

To run the dead link checker manually:

1. Go to the **Actions** tab in the GitHub repository
2. Select **🔗 Check Dead Links** workflow
3. Click **Run workflow**
4. Choose whether to create issues for dead links (default: true)
5. Click **Run workflow** button

## Issue Management

When dead links are detected:

### New Issues
- Creates a new issue with title: `🔗 Dead Links - YYYY-MM-DD`
- Labels: `bug`, `automated`
- Contains detailed report with failed links and recommendations

### Existing Issues
- Updates existing open dead link issues with new reports
- Avoids creating duplicate issues

### Issue Content
Each issue includes:
- **Report Details**: Specific failed links and error codes
- **Recommended Actions**: Step-by-step remediation guide
- **Files to Check**: List of files containing the problematic links

## Troubleshooting

### Common Link Failures

1. **Rate Limited (429)**: Social media sites often rate limit automated requests
   - **Solution**: These are considered valid links (429 is accepted)

2. **CDN Timeouts**: External CDN resources may occasionally timeout
   - **Solution**: Check if the CDN is temporarily down

3. **Redirects**: Some organizations change their URLs
   - **Solution**: Update links to new URLs or find alternative sources

4. **Domain Changes**: Organizations may change domains entirely
   - **Solution**: Research new official URLs or remove outdated links

### False Positives

Some sites may block automated requests but work fine in browsers:
- Social media platforms (LinkedIn, Facebook, Instagram)
- Enterprise websites with bot protection
- Sites requiring specific user agents

**Action**: Manually verify these links before removing them.

## Maintenance

### Regular Tasks
- Review dead link issues weekly
- Update `structured-data.jsonld` with corrected URLs
- Remove or replace permanently dead links
- Close resolved dead link issues

### Workflow Updates
The workflow file is located at: `.github/workflows/check-dead-links.yml`

To modify behavior:
- Adjust cron schedule for different run times
- Add/remove file patterns to check
- Modify accepted status codes
- Update user agent string

## Integration with Site Updates

When updating links in the website:

1. **Content Links**: Update `structured-data.jsonld`
2. **CDN Links**: Update `index.html`  
3. **Documentation**: Update relevant markdown files
4. **Testing**: Run the dead link checker manually to verify fixes

## Performance

- **Execution Time**: Typically 2-5 minutes depending on number of links
- **Rate Limiting**: Built-in delays prevent overwhelming target servers
- **Caching**: Reduces redundant checks and improves performance
- **Parallel Processing**: lychee handles multiple links concurrently

---

**Note**: This workflow helps maintain the quality and reliability of external links on the 3dime website, ensuring a better user experience and maintaining SEO benefits.