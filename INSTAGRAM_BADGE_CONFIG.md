# Instagram Badge Configuration

This document describes how to configure and use the Instagram follower count badge feature.

## Basic Configuration

Add the following to your `config.php` file:

```php
// Instagram configuration
define('IG_USERNAME', 'your_instagram_username');
```

## Advanced Configuration (for real Instagram API access)

For production use with real Instagram follower data, you need to set up Instagram API access:

1. Create a Facebook Developer account at https://developers.facebook.com/
2. Create a new app and enable Instagram Basic Display API
3. Complete the app review process for Instagram Basic Display API
4. Get your access token through OAuth flow
5. Add the access token to config.php:

```php
// Instagram configuration with API access
define('IG_USERNAME', 'your_instagram_username');
define('IG_ACCESS_TOKEN', 'your_instagram_access_token_here');
```

## Current Implementation

The current implementation includes:

- **Graceful fallback**: Returns a mock value (1234) for demonstration
- **Error handling**: Returns appropriate error if username not configured
- **Consistent styling**: Uses the same badge styling as other social badges
- **Configuration validation**: Checks if required constants are defined

## Testing

Test the Instagram service endpoint directly:

```bash
curl "http://localhost:8000/proxy.php?service=instagram"
```

Expected responses:
- Success: `{"followers":1234}` (mock data)
- Error: `{"error":"Instagram username not configured"}` (if IG_USERNAME not set)

## Badge Display

The follower count appears as a red badge in the top-right corner of the Instagram icon in the social section, consistent with other social badges (GitHub repositories, Trakt movies).

## API Limitations

Instagram's official API has strict requirements:
- App review process required
- Rate limiting applies
- Access tokens expire and need refresh
- Business/Creator accounts may be required

For development/demo purposes, the current implementation uses mock data that can be easily replaced with real API calls when proper authentication is configured.