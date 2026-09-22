/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // CI runs `pnpm run lint` separately; keep build unblocked until debt cleared.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // QUALITY-TS-001: tsc --noEmit clean (legacy files quarantined with @ts-nocheck).
    ignoreBuildErrors: false,
  },
  images: {
    domains: ['storage.googleapis.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://*.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://googleads.g.doubleclick.net https://www.googleadservices.com https://www.google.com https://www.gstatic.com https://*.gstatic.com https://connect.facebook.net https://challenges.cloudflare.com https://static.cloudflareinsights.com https://tagmanager.google.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://tagmanager.google.com https://www.gstatic.com",
              "img-src 'self' data: blob: https://storage.googleapis.com https://*.google-analytics.com https://*.googletagmanager.com https://googleads.g.doubleclick.net https://www.google.com https://*.google.com https://www.facebook.com https://lh3.googleusercontent.com https://ssl.gstatic.com https://www.gstatic.com https://*.gstatic.com",
              "font-src 'self' data: https://fonts.gstatic.com https://www.gstatic.com",
              "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://googleads.g.doubleclick.net https://www.google.com https://www.gstatic.com https://*.gstatic.com https://www.facebook.com https://challenges.cloudflare.com https://cloudflareinsights.com https://static.cloudflareinsights.com https://storage.googleapis.com https://stats.g.doubleclick.net https://www.googleadservices.com",
              "frame-src 'self' https://challenges.cloudflare.com https://www.googletagmanager.com https://td.doubleclick.net https://www.google.com https://maps.google.com https://www.gstatic.com",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      { source: '/services/hardscapes', destination: '/services/hardscaping', permanent: true },
      { source: '/account', destination: '/portal', permanent: false },
      { source: '/invoices', destination: '/portal', permanent: false },
      { source: '/testimonials', destination: '/our-work', permanent: true },
      { source: '/bundles/total-home', destination: '/bundles/residential', permanent: true },
      { source: '/bundles/landscape', destination: '/bundles/residential', permanent: true },
      { source: '/search', destination: '/services', permanent: false },
      {
        source: '/blog/10-tips-for-lush-green-lawn',
        destination: '/blog',
        permanent: false,
      },
      {
        source: '/blog/benefits-of-professional-pest-control',
        destination: '/blog',
        permanent: false,
      },
      {
        source: '/blog/seasonal-lawn-care-spring',
        destination: '/blog',
        permanent: false,
      },
      {
        source: '/case-studies/:slug',
        destination: '/case-studies',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
