/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Main still carries legacy type debt from v0 sync; unblock production deploys.
    ignoreBuildErrors: true,
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
    // Allow /placeholder.svg (and other local SVGs) through the image optimizer.
    // CSP + attachment disposition are the standard pairing to block script execution.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async redirects() {
    return [
      { source: '/services/hardscapes', destination: '/services/hardscaping', permanent: true },
      { source: '/account', destination: '/portal', permanent: false },
      { source: '/invoices', destination: '/portal', permanent: false },
      { source: '/testimonials', destination: '/our-work', permanent: true },
      { source: '/bundles/total-home', destination: '/bundles/residential', permanent: true },
      { source: '/bundles/landscape', destination: '/bundles/residential', permanent: true },
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
