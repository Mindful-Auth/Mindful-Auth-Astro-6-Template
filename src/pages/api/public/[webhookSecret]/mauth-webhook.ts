// Mindful Auth Webhook Handler
// Receives webhook events and sends transactional emails via Postmark.
// Create an account at https://www.postmarkapp.com/?via=mindfulauth (affiliate link).
//
// Webhook URL Format: https://app.yourdomain.com/api/public/[webhookSecret]/mauth-webhook
// The [webhookSecret] is a unique identifier that must match the WEBHOOK_SECRET environment variable.
// This provides security through obscurity - the endpoint URL becomes unguessable.
//
// This pattern demonstrates a recommended way to protect public API endpoints:
// Other developers can follow this same approach for their own public endpoints by
// using a [secret] parameter and validating it against an environment variable.
//
// Setup Instructions:
// 1. Generate a unique secret (SHA256 hash recommended):
//    node -e "console.log('sha256_' + require('crypto').randomBytes(32).toString('hex'))"
// 2. Add to wrangler.jsonc under your environment:
//    "env": {
//      "production": {
//        "vars": {
//          "WEBHOOK_SECRET": "sha256_your_generated_secret_here"
//        }
//      }
//    }
// 3. Configure this full URL in Mindful Auth webhook settings:
//    https://app.yourdomain.com/api/public/sha256_your_generated_secret_here/mauth-webhook
//
// Required environment variables:
//   WEBHOOK_SECRET       – Unique identifier for this webhook endpoint (prevents unauthorized access)
//   POSTMARK_API_TOKEN   – Your Postmark server API token
//   EMAIL_FROM           – Verified sender address (e.g. "App Name <no-reply@example.com>")

import type { APIRoute } from 'astro';
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendMagicLinkEmail,
} from '@/lib/email';

// ── Webhook payload types from Mindful Auth

interface BasePayload {
  event_type: string;
  recordid: string;
  email: string;
  name: string;
}

interface PasswordResetPayload extends BasePayload {
  event_type: 'password_reset';
  resetLink: string;
}

interface VerifyEmailPayload extends BasePayload {
  event_type: 'verify_email';
  verificationLink: string;
}

interface MagicLoginPayload extends BasePayload {
  event_type: 'magic_login';
  magicLoginLink: string;
}

type WebhookPayload = PasswordResetPayload | VerifyEmailPayload | MagicLoginPayload;

// ── Route handler

export const POST: APIRoute = async ({ request, params }) => {
  try {
    // ── Verify webhook secret ──
    const WEBHOOK_SECRET = import.meta.env.WEBHOOK_SECRET;
    const urlSecret = params.webhookSecret;

    if (!WEBHOOK_SECRET) {
      console.error('[Webhook] Missing WEBHOOK_SECRET environment variable');
      return new Response(JSON.stringify({ error: 'Server misconfigured' }), { status: 500 });
    }

    if (!urlSecret || urlSecret !== WEBHOOK_SECRET) {
      // Return 404 to hide the existence of the endpoint
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
    }

    // ── Environment variables ──
    const POSTMARK_API_TOKEN = import.meta.env.POSTMARK_API_TOKEN;
    const EMAIL_FROM = import.meta.env.EMAIL_FROM;

    if (!POSTMARK_API_TOKEN || !EMAIL_FROM) {
      console.error('[Webhook] Missing required env vars: POSTMARK_API_TOKEN and/or EMAIL_FROM');
      return new Response(JSON.stringify({ error: 'Server misconfigured' }), { status: 500 });
    }

    // ── Parse payload ──
    const payload: WebhookPayload = await request.json();
    const { event_type, email, name } = payload;

    // ── Log payload (main webhook event) ──
    console.info('[Webhook Received]', {
      event_type,
      email,
      name,
      recordid: payload.recordid,
      payload,
    });

    // ── Dispatch by event type ──
    switch (event_type) {
      case 'verify_email': {
        const { verificationLink } = payload as VerifyEmailPayload;
        await sendVerificationEmail(POSTMARK_API_TOKEN, EMAIL_FROM, email, name, verificationLink);
        break;
      }

      case 'password_reset': {
        const { resetLink } = payload as PasswordResetPayload;
        await sendPasswordResetEmail(POSTMARK_API_TOKEN, EMAIL_FROM, email, name, resetLink);
        break;
      }

      case 'magic_login': {
        const { magicLoginLink } = payload as MagicLoginPayload;
        await sendMagicLinkEmail(POSTMARK_API_TOKEN, EMAIL_FROM, email, name, magicLoginLink);
        break;
      }

      default:
        console.warn(`Unhandled event type: ${event_type}`);
        return new Response(
          JSON.stringify({ error: `Unhandled event type: ${event_type}` }),
          { status: 400 },
        );
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('[Webhook Error]:', errorMessage);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500 },
    );
  }
};

// GET handler for testing endpoint accessibility
export const GET: APIRoute = async ({ params }) => {
  const WEBHOOK_SECRET = import.meta.env.WEBHOOK_SECRET;
  const urlSecret = params.webhookSecret;

  // Return 404 if secret doesn't match (consistent with POST)
  if (!urlSecret || urlSecret !== WEBHOOK_SECRET) {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  }

  return new Response(JSON.stringify({ 
    status: 'Webhook endpoint is active',
    method: 'POST',
    note: 'This endpoint accepts POST requests from Mindful Auth'
  }), { 
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};