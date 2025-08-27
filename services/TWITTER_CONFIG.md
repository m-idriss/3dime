# Twitter Follower Badge Configuration

This document explains how to configure the Twitter follower badge feature.

## Prerequisites

1. A Twitter Developer Account
2. A Twitter App with Bearer Token access

## Configuration Steps

1. **Get Twitter Developer Access**:
   - Visit [developer.twitter.com](https://developer.twitter.com)
   - Apply for a developer account
   - Create a new Twitter App

2. **Generate Bearer Token**:
   - In your Twitter App dashboard
   - Go to "Keys and tokens"
   - Generate a "Bearer Token"

3. **Update config.php**:
   ```php
   // Twitter/X configuration
   define('X_USERNAME', 'your_actual_twitter_username'); // without @
   define('X_BEARER_TOKEN', 'your_actual_bearer_token_here');
   ```

## API Endpoints Used

- `GET /2/users/by/username/{username}` - Get user ID from username
- `GET /2/users/{id}?user.fields=public_metrics` - Get follower count

## Error Handling

The implementation includes graceful error handling:
- If `X_USERNAME` is not configured: Returns error with followers count 0
- If `X_BEARER_TOKEN` is not configured: Returns error with followers count 0  
- If API calls fail: Returns error with followers count 0
- Badge is only displayed when follower count > 0

## Testing

Test the endpoint directly:
```bash
curl "http://localhost:8000/proxy.php?service=x"
```

Expected responses:
- **Success**: `{"followers": 1234}`
- **Config Error**: `{"error": "X_BEARER_TOKEN not configured", "followers": 0}`