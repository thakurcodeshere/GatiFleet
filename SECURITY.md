# Security Policy

We are committed to resolving security vulnerabilities quickly and privately to protect all organizations and individuals using GatiFleet.

## Supported Versions

We actively maintain and support the following versions of GatiFleet with security updates and patches:

| Version | Supported |
| ------- | --------- |
| 1.x.x   | Yes       |
| < 1.0   | No        |

## Reporting a Vulnerability

If you identify a security vulnerability in GatiFleet, **please do not disclose it in public issues or pull requests.**

### Method 1: GitHub Private Vulnerability Reporting (Recommended)
GitHub offers native Private Vulnerability Reporting. This allows you to report vulnerabilities directly to repository maintainers in a secure workspace:
1. Navigate to the repository home page on GitHub.
2. Click on the **Security** tab.
3. Select **Advisories** on the left menu.
4. Click **Report a vulnerability** to open a private draft advisory.

### Method 2: Encrypted Email
If you prefer email communication, please send detailed reports to our security lead:
* **Contact Email**: thakurcoding@gmail.com

Please include:
* Description of the vulnerability and its potential impact.
* Steps to reproduce the issue (including proof of concept scripts or screenshots).
* Any recommended patches or mitigations.

## Our Security Commitment

When a vulnerability report is received, the maintainers will:
1. **Acknowledge** receipt of the report within 24–48 hours.
2. **Triage and verify** the vulnerability in a private workspace.
3. **Develop a patch** privately (utilizing GitHub Security Advisory private forks).
4. **Publish a security advisory** and release a patched version of GatiFleet within 14–30 days.

## Automated Scans

To maintain high security standards, the repository runs automated scans:
- **Dependabot**: Checks for vulnerable npm packages weekly.
- **CodeQL**: SAST analysis verifying code injection and XSS safety on every push.
- **Gitleaks**: Secrets checking to prevent accidental key leaks.
