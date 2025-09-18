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
?>
```

### 4. Test PHP Services

```bash
# Start PHP development server
php -S localhost:8000

# Test GitHub API proxy
curl "http://localhost:8000/proxy.php?service=github"

# Test commit data for heatmap (shows activity from all repositories)
curl "http://localhost:8000/proxy.php?service=github&type=commits"
```

## 🔑 API Token Setup

### GitHub Token (Recommended)

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select scopes: `public_repo` (for public repositories)
4. Copy the token and add to `config.php`

**Benefits**: Higher rate limits (5,000/hour vs 60/hour)

### ⚠️ Removed Services

The following services have been removed as of the latest version:
- **Twitter/X API integration**: Removed to simplify the codebase
- **Trakt TV API integration**: Removed to simplify the codebase

Social media links remain available as static links in the website.

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

**GitHub Heatmap Not Loading**:
- Ensure `config.php` exists (copy from `config.php.example`)
- Set `GITHUB_USERNAME` in config.php (GITHUB_REPO is no longer required as we fetch from all repositories)
- Add `GITHUB_TOKEN` for higher rate limits (optional but recommended)
- Check that user events endpoint works: `curl "yoursite.com/proxy.php?service=github&type=commits"`

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