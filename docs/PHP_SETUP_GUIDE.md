# 🔧 PHP Setup Guide

This guide helps you set up the enhanced PHP backend services for 3dime.

## 🎯 Overview

3dime supports two deployment modes:

- **Static Mode**: Core features work without PHP (recommended for beginners)
- **Enhanced Mode**: Additional features with PHP backend services

## 🚀 Quick Setup

### 1. Check PHP Requirements

```bash
# Check PHP version (7.4+ required)
php --version

# Check curl extension
php -m | grep curl
```

### 2. Copy Configuration

```bash
# Copy the configuration template
cp config/config.php.example config/config.php
```

### 3. Edit Configuration

Open `config/config.php` and update with your credentials:

```php
<?php
// GitHub API (recommended for best experience)
define('GITHUB_TOKEN', 'ghp_your_token_here');
define('GITHUB_USERNAME', 'your-username');
define('GITHUB_REPO', 'your-main-repo');

// Optional: Twitter/X API
define('X_BEARER_TOKEN', 'your_bearer_token');
define('X_USERNAME', 'your_twitter_handle');

// Optional: Trakt TV API
define('TRAKT_CLIENT_ID', 'your_trakt_client_id');
?>
```

### 4. Test PHP Services

```bash
# Start PHP development server
php -S localhost:8000

# Test GitHub API proxy
curl "http://localhost:8000/config/proxy.php?service=github"

# Test commit data for heatmap
curl "http://localhost:8000/config/proxy.php?service=github&type=commits"
```

## 🔑 API Token Setup

### GitHub Token (Recommended)

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select scopes: `public_repo` (for public repositories)
4. Copy the token and add to `config.php`

**Benefits**: Higher rate limits (5,000/hour vs 60/hour)

### Twitter/X Bearer Token (Optional)

1. Apply for [Twitter Developer Account](https://developer.twitter.com/)
2. Create an app and get Bearer Token
3. Add to `config.php`

**Features**: Real-time follower count display

### Trakt Client ID (Optional)

1. Register at [Trakt API](https://trakt.tv/oauth/applications)
2. Create an application
3. Copy Client ID to `config.php`

**Features**: Movie watching statistics

## 🛠️ Deployment

### Shared Hosting (cPanel, etc.)

1. Upload all files via FTP/File Manager
2. Ensure `config/config.php` has correct permissions (644)
3. Test by visiting `https://yoursite.com/config/proxy.php?service=github`

### VPS/Dedicated Server

```bash
# With Apache
sudo a2enmod rewrite
sudo systemctl restart apache2

# With Nginx + PHP-FPM  
sudo systemctl start php7.4-fpm nginx
```

### Cloud Platforms

- **AWS**: Use EC2 with PHP + Apache/Nginx
- **DigitalOcean**: Use App Platform or Droplet
- **Google Cloud**: Use App Engine flexible environment

## 🐛 Troubleshooting

### Common Issues

**"Failed to fetch data" Error**:
- Check PHP curl extension is installed
- Verify API tokens are correct
- Check server error logs

**CORS Errors**:
- Ensure `proxy.php` includes proper CORS headers
- Check browser developer tools for specific errors

**Rate Limiting**:
- Add GitHub token for higher limits
- Check API usage in GitHub settings

### Error Checking

```bash
# Check PHP error logs
tail -f /var/log/php_errors.log

# Test specific service
php -f config/proxy.php
```

### Fallback Behavior

When PHP services fail, 3dime gracefully falls back to:
- Static GitHub profile links
- Generic social media links  
- Manual content display

## 📚 API Documentation

See detailed API documentation:
- [GitHub API Docs](services/GITHUB_API_DOCS.md)
- [Twitter Configuration](services/TWITTER_CONFIG.md)

## 🔒 Security Best Practices

1. **Never commit** `config.php` to version control
2. **Use environment variables** for production secrets
3. **Validate all inputs** in PHP services
4. **Monitor API usage** to prevent abuse
5. **Regular token rotation** for security

## 📞 Support

For issues with PHP setup:
1. Check the [troubleshooting section](#-troubleshooting)
2. Review [Developer Guide](DEVELOPER_GUIDE.md)
3. Open an issue on GitHub with error details