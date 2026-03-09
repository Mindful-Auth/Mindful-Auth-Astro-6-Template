// Astro configuration for Mindful Auth Portal
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import { mauthSecurityConfig, getMauthViteDefines } from '@mindfulauth/core/config';
import { getScriptHashes } from '@mindfulauth/core/csp';

// Configure Mindful Auth: customize skip assets
const mauthCfg = mauthSecurityConfig({
    // Add custom static asset paths that should skip session validation.
    // SECURITY CRITICAL: Only add actual static file requests here. Examples of safe entries: /favicon.ico, /robots.txt, /sitemap.xml. NEVER add application routes like [memberid]/dashboard,  [memberid]/profile,  [memberid]/secure/* - this COMPLETELY bypasses authentication. If you add a route here, unauthenticated users can access it without logging in.
    skipAssets: [
        // Example: '/sitemap.xml',
        // Example: '/manifest.webmanifest',
    ],
});

// Export the Astro configuration
export default defineConfig({
    // Server-side rendering required for session validation
    output: 'server',

    // Deploy to Cloudflare Workers (change adapter for other platforms)
    adapter: cloudflare({
        routes: {
            // Serve static assets directly without going through SSR middleware
            include: ['/favicon.ico', '/robots.txt', '/.well-known/'],
            exclude: [],
        }
    }),

    image: {
        service: { entrypoint: 'astro/assets/services/sharp' }
    },

    vite: {
        define: getMauthViteDefines(mauthCfg),
        ssr: {
            external: ['cloudflare:workers']
        }
    },

    // Astro security configuration
    security: {
        checkOrigin: true,
        allowedDomains: [
            { hostname: 'astro-6-beta.mindfulvm.com', protocol: 'https' }
        ],
        // Maximum body size for action requests (enforced at Astro level)
        // Set to 1 MB for authentication operations. You can increase this value for other actions (e.g., file uploads), but auth flows will be limited to 1 MB by the Mindful Auth Worker independently. This ensures authentication operations stay lean and protected.
        actionBodySizeLimit: 1048576, // 1 MB

        // Astro 6 native Content Security Policy.
        // Enables automatic hash-based CSP for script-src and style-src via <meta> tag. NOTE: Does not apply in dev mode - test with `astro build && astro preview`.
        csp: {
            // Use SHA-384 for stronger hash security
            algorithm: 'SHA-384',
            // Script sources: allow self + Cloudflare (Turnstile) + Mindful Auth API
            // ⚠️ Do not remove these - required for authentication to function
            scriptDirective: {
                resources: [
                    "'self'",
                    'https://api.mindfulauth.com',
                    'https://challenges.cloudflare.com',
                    'https://*.cloudflareinsights.com'
                ],
                // SHA-384 hashes for <script is:inline> in mindfulauth/astro/ — auto-computed at build time.
                hashes: getScriptHashes(),
            },
            // Style sources: self only (Astro auto-injects hashes for bundled styles)
            styleDirective: {
                resources: ["'self'"]
            },
            // Additional CSP directives beyond script-src and style-src
            directives: [
                "default-src 'none'",
                "connect-src 'self' https://api.mindfulauth.com https://challenges.cloudflare.com",
                "frame-src 'self' https://challenges.cloudflare.com",
                "frame-ancestors 'none'",
                "font-src 'self' data:",
                "img-src 'self' https: data:",
                "media-src 'self' https:",
                "worker-src 'self' blob:",
                "manifest-src 'self'",
                "object-src 'none'",
                "base-uri 'self'",
                "form-action 'self'",
                "require-trusted-types-for 'script'",
                "upgrade-insecure-requests"
            ],
        }
    }
});