# GitHub API Proxy Enhancement

This document describes the enhanced GitHub API functionality in `proxy.php`.

## Overview

The proxy now supports both user-level and repository-specific GitHub API calls with optional authentication for better rate limits.

## Configuration

Add these environment variables or update `config.php`:

```php
// Optional: GitHub Personal Access Token for authentication
define('GITHUB_TOKEN', getenv('GITHUB_TOKEN') ?: '');

// Default GitHub username and repository
define('GITHUB_USERNAME', 'm-idriss');
define('GITHUB_REPO', '3dime');
```

## API Endpoints

### User Statistics
```
GET /proxy.php?service=github
GET /proxy.php?service=github&type=user
```

**Returns:**
```json
{
  "user_id": 12345,
  "repos": 25,
  "followers": 150,
  "following": 200
}
```

### Repository Statistics
```
GET /proxy.php?service=github&type=repo
GET /proxy.php?service=github&type=repo&repo=repository-name
```

**Returns:**
```json
{
  "repo_id": 67890,
  "name": "3dime",
  "full_name": "m-idriss/3dime",
  "stars": 42,
  "forks": 12,
  "watchers": 42,
  "issues": 3,
  "size": 1024,
  "language": "HTML",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2024-12-01T00:00:00Z"
}
```

## Badge Integration

### Repository Stars (Recommended)
```javascript
updateBadge('github', 'badge-github', 'stars', { type: 'repo' });
```

### Repository ID (As requested in issue)
```javascript
updateBadge('github', 'badge-github-id', 'repo_id', { type: 'repo' });
```

### Repository Forks
```javascript
updateBadge('github', 'badge-github-forks', 'forks', { type: 'repo' });
```

### User Repository Count (Original behavior)
```javascript
updateBadge('github', 'badge-github', 'repos', { type: 'user' });
```

### Custom Repository
```javascript
updateBadge('github', 'badge-custom', 'stars', { 
  type: 'repo', 
  repo: 'another-project' 
});
```

## Authentication Benefits

- **Without token**: 60 requests/hour per IP
- **With token**: 5,000 requests/hour
- **Setup**: Set `GITHUB_TOKEN` environment variable

## Rate Limiting

The proxy handles GitHub rate limits gracefully:
- Returns HTTP 429 when rate limited
- Includes error message in JSON response
- Supports both authenticated and anonymous requests

## Error Handling

- **500**: API connection errors or invalid JSON
- **429**: Rate limit exceeded
- **4xx**: GitHub API errors (passed through)
- **200**: Successful response with data

## Example Content.json Configuration

To use repository ID in your badge:

```json
{
  "name": "GitHub",
  "url": "https://github.com/m-idriss/3dime",
  "iconClass": "fa-github",
  "badge": "0",
  "badgeId": "badge-github",
  "wrapperClass": "icon-wrapper"
}
```

Then update your JavaScript:
```javascript
// Show repository ID (as requested)
updateBadge('github', 'badge-github', 'repo_id', { type: 'repo' });

// Or show stars (more user-friendly)
updateBadge('github', 'badge-github', 'stars', { type: 'repo' });
```