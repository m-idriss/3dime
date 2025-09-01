# Security Headers Configuration

This document explains the security headers implementation for the 3dime social hub website.

## Issue with Meta Tags

Certain security headers cannot be effectively implemented via HTML meta tags and must be delivered as HTTP headers from the server:

- `frame-ancestors` directive in Content Security Policy
- `X-Frame-Options` header

When these are delivered via meta tags, browsers will show console warnings like:
- "The Content Security Policy directive 'frame-ancestors' is ignored when delivered via an HTML meta element."
- "The X-Frame-Option 'DENY' supplied in a <meta> element was ignored. X-Frame-Options may only be provided by an HTTP header sent with the document."

## Solution

### HTML Meta Tags (`index.html`)
The HTML meta tags now contain only the CSP directives that work effectively in meta tags:
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://unpkg.com https://d3js.org; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://unpkg.com https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https:; connect-src 'self' https://api.github.com; base-uri 'self'; form-action 'self';">
```

### HTTP Headers (`.htaccess`)
The complete security configuration is provided via HTTP headers in the `.htaccess` file for Apache servers:
```apache
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://unpkg.com https://d3js.org; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://unpkg.com https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https:; connect-src 'self' https://api.github.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
Header always set X-Frame-Options "DENY"
```

## Server Configuration Examples

### Apache (`.htaccess` included)
The repository includes a complete `.htaccess` file with all necessary security headers.

### Nginx
For Nginx servers, add to your server block:
```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://unpkg.com https://d3js.org; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://unpkg.com https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https:; connect-src 'self' https://api.github.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
```

### Cloudflare
If using Cloudflare, you can set these headers via Transform Rules or Page Rules in the dashboard.

### Node.js/Express
```javascript
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://unpkg.com https://d3js.org; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://unpkg.com https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https:; connect-src 'self' https://api.github.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';");
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});
```

## Testing

To verify the headers are working correctly:
1. Deploy with your server configuration
2. Use browser developer tools → Network tab → check response headers
3. Use online tools like securityheaders.com to scan your deployed site
4. Verify no console warnings about ignored security directives

## Benefits

This implementation provides:
- ✅ No browser console warnings about ignored security directives
- ✅ Complete CSP protection including frame-ancestors
- ✅ Proper X-Frame-Options protection
- ✅ Additional security headers (HSTS, Referrer-Policy, etc.)
- ✅ Fallback protection via meta tags for basic CSP directives