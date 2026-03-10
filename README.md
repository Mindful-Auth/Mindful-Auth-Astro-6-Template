# Astro 6 Authentication Template: Mindful Auth (Cloudflare Workers + D1)
> **Cloudflare Worker-Native Authentication Framework optimized for Astro 6.**

[![Astro 6 Ready](https://img.shields.io/badge/Astro-6.0%2B-ff5d01?logo=astro)](https://astro.build)
[![Deployment: Cloudflare Workers](https://img.shields.io/badge/Deployment-Cloudflare_Workers-f38020?logo=cloudflare-workers)](https://workers.cloudflare.com)
[![Database: D1](https://img.shields.io/badge/Database-Cloudflare_D1-f38020?logo=cloudflare)](https://docs.mindfulauth.com/guides/backend/d1/d1-tables/) [![Database: Tape](https://img.shields.io/badge/Database-Tape-0561FF?logo=serverless&logoColor=white)](https://docs.mindfulauth.com/guides/backend/tape/tape-template/)

**[Mindful Auth](https://mindfulauth.com)** is a production-ready authentication template re-engineered specifically for **Astro 6 on Cloudflare Workers**. It provides a secure, scalable, and privacy-focused authentication solution that runs entirely at the Edge. By leveraging Astro 6 **Content Layer**, **Middleware**, and **CSP**, it delivers a seamless authentication experience with zero latency. 

## Prerequisites
Ensure you have the following:
* Node.js 22+
* A Cloudflare Account (Free tier works perfectly for D1 and Workers).
* Turnstile Site Key and Secret Key for bot protection (Free from Cloudflare).
* A registered subdomain for onboarding in the Mindful Auth dashboard.
* Wrangler CLI installed and authenticated (`npx wrangler login`).
* A Postmark, Resend or any other automation tools such as Make, n8n, or Zapier to handle transactional emails (verification, password reset, etc.).

---
### 🎁 Limited Beta: 20 Founding Developer Slots
We are looking for 20 developers to stress-test our Astro 6 + Worker implementation.
- Free Lifetime Access | Direct Founder Support | Roadmap Influence
👉 **[Apply for the Beta here](https://go.mindfulauth.com/beta-form)**
---

## Quick Start

1) **[Create a Mindful Auth account](https://docs.mindfulauth.com/guides/mauth/setup/create-account/)** at [app.mindfulauth.com/register](https://app.mindfulauth.com/register).
2) **[Set up your Astro frontend](https://docs.mindfulauth.com/guides/frontend/astro/astro-overview/)** - Initialize your project using this template.
3) **[Get Turnstile credentials](https://docs.mindfulauth.com/guides/mauth/setup/turnstile/)** - Add your Site Key and Secret Key (required for bot protection).
4) **[Setup Email Webhooks](https://docs.mindfulauth.com/guides/mauth/setup/webhooks/)** - Connect Postmark, Resend, or Make/n8n. Includes a pre-configured Postmark handler.
5) **Setup your Backend** - Initialize **[Cloudflare D1 Tables](https://docs.mindfulauth.com/guides/backend/d1/d1-tables/)** or connect your **[Tape Workspace](https://docs.mindfulauth.com/guides/backend/tape/tape-template/)**.
6) **[Onboard hostname](https://docs.mindfulauth.com/guides/mauth/setup/onboarding/)** - Add your deployment URL (e.g. `portal.myapp.com`) to the dashboard.
7) **Deploy your Worker** - Use `npm run build` and `npx wrangler deploy` to push your changes to Cloudflare Workers.
8) **[Set INTERNAL_API_KEY](https://docs.mindfulauth.com/guides/mauth/setup/internal-api/)** - Add this as an encrypted secret in your Cloudflare dashboard (never in `.env`).

> Full docs: [https://docs.mindfulauth.com](https://docs.mindfulauth.com/)

## Mindful Auth Features

- **Astro 6.0+ Optimized** - Native support for CSP, SSR, and Middleware.
- **Astro Actions Ready** - Type-safe, client-to-server communication for all auth flows.
- **Fully Headless** - Total control over your UI. No "black-box" components or forced styling.
- **[Password Authentication](https://docs.mindfulauth.com/guides/mauth/options/password-auth/)** - Traditional email + password with secure verification links.
- **[Magic Link Authentication](https://docs.mindfulauth.com/guides/mauth/options/magic-login/)** - Passwordless login with four distinct security layers.
- **[Two-Factor Authentication](https://docs.mindfulauth.com/guides/mauth/options/two-factor-auth/)** - TOTP-based 2FA for maximum account security.
- **[Audit Logs](https://docs.mindfulauth.com/guides/mauth/options/audit-logs/)** - Track all authentication events for security and compliance.
- **[Six-Layer Defense System](https://docs.mindfulauth.com/guides/mauth/security/rate-limits/)** - Comprehensive rate limits, bot protection, and anomaly detection.
- **[Shared Security Model](https://docs.mindfulauth.com/guides/mauth/security/shared-responsibility/)** - We secure the auth layer; you keep 100% control of your member data.

## Need help? 
* [Send us a message](https://mindfulauth.com/contact) 
* [YouTube Channel](https://www.youtube.com/@MindfulAuth)
* [LinkedIn](https://www.linkedin.com/showcase/mindful-auth/)
* [Discord community](https://discord.gg/vqXjBEyDvW)