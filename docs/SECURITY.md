# Security Policy

## Overview

3dime takes the security of our software products and services seriously. This security policy outlines our approach to security, how to report vulnerabilities, and our commitment to maintaining a secure platform for all users.

## Supported Versions

We provide security updates for the following versions of 3dime:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < Latest| :x:                |

As a continuously deployed web application, we maintain only the latest version in production. All security fixes are applied to the current release.

## Reporting a Vulnerability

We encourage responsible disclosure of security vulnerabilities. If you discover a security issue, please follow these steps:

### How to Report

1. **DO NOT** create a public GitHub issue for security vulnerabilities
2. Email security reports to: **contact@3dime.com** or contact the repository owner directly
3. Include the following information in your report:
   - Description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact assessment
   - Suggested remediation (if any)
   - Your contact information for follow-up

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your report within 48 hours
- **Initial Assessment**: We will provide an initial assessment within 5 business days
- **Progress Updates**: We will keep you informed of our progress throughout the investigation
- **Resolution**: We aim to resolve critical vulnerabilities within 30 days
- **Credit**: With your permission, we will credit you in our security advisories

## Security Measures

### Current Implementation

3dime implements several security measures:

- **Content Security Policy (CSP)**: Helps prevent XSS attacks
- **Secure Headers**: X-Frame-Options, X-Content-Type-Options, etc.
- **HTTPS Enforcement**: All communications encrypted in transit
- **Input Validation**: Server-side validation for all user inputs
- **Secure External Links**: `rel="noopener noreferrer"` attributes

### Planned Enhancements

Ongoing security improvements include:
- Enhanced CSP implementation
- Regular security audits
- Dependency vulnerability scanning
- Automated security testing

## Scope

This security policy covers:

- **3dime Web Application**: The main website and PWA
- **Backend Services**: PHP proxy and API endpoints
- **Third-party Integrations**: GitHub API, social media APIs
- **Infrastructure**: Deployment and hosting environment

## Security Best Practices

### For Contributors

If you're contributing to 3dime, please follow these security guidelines:

1. **Code Review**: All code changes require review before merging
2. **Dependency Management**: Keep all dependencies up to date
3. **Input Sanitization**: Always validate and sanitize user inputs
4. **Error Handling**: Don't expose sensitive information in error messages
5. **Authentication**: Use secure authentication mechanisms for any admin features

### For Users

- Keep your browser updated to the latest version
- Be cautious when clicking external links
- Report any suspicious behavior or potential security issues

## Vulnerability Disclosure Timeline

Our typical vulnerability response process:

1. **Day 0**: Vulnerability reported
2. **Day 1-2**: Acknowledgment sent to reporter
3. **Day 3-7**: Initial assessment and triage
4. **Day 8-30**: Investigation, development, and testing of fix
5. **Day 30+**: Fix deployed and public disclosure (if appropriate)

For critical vulnerabilities that pose immediate risk, we may expedite this timeline.

## Legal

- We will not pursue legal action against researchers who follow responsible disclosure
- We ask that you do not access, modify, or delete user data
- Please respect user privacy and do not access personal information
- Testing should be limited to your own accounts or with explicit permission

## Contact Information

- **Security Email**: contact@3dime.com (preferred for security issues)
- **General Contact**: Via GitHub issues for non-security related matters
- **Repository Owner**: [@m-idriss](https://github.com/m-idriss)

## Updates

This security policy may be updated periodically. Significant changes will be announced via:
- Repository notifications
- Security advisories (if applicable)
- Direct communication with previous reporters

## Additional Resources

- [Security Recommendations](SITE_REVIEW_RECOMMENDATIONS.md#5-security-enhancements) - Detailed technical security guidelines
- [Contributing Guidelines](README.md) - General contribution guidelines
- [License](LICENSE) - Project license information

---

*Last Updated: August 2025*

Thank you for helping keep 3dime and our users safe!