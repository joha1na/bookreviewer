/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Optimierungen für bessere Performance
    // typedRoutes: true, // Temporär deaktiviert für bessere Kompatibilität
  },
  // Basis Konfiguration
  reactStrictMode: true,
  
  // Output für Docker Production Build
  output: 'standalone',
  
  // Image Optimization
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Redirect für Express Kompatibilität
  async redirects() {
    return [
      {
        source: '/',
        destination: '/books',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
