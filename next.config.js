/** @type {import('next').NextConfig} */
const nextConfig = {
  // ===== الإعدادات الأساسية =====
  reactStrictMode: true,
  poweredByHeader: false, // إخفاء X-Powered-By لأسباب أمنية
  
  // ===== إعدادات الصور =====
  images: {
    domains: [
      'images.unsplash.com',
      'your-cdn-domain.com' // أضف نطاقاتك هنا
    ],
    formats: ['image/avif', 'image/webp'], // تنسيقات حديثة
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com', // السماح بجميع النطاقات الفرعية
      },
    ],
  },

  // ===== إعدادات المترجم =====
  compiler: {
    styledComponents: true, // إذا كنت تستخدم styled-components
    removeConsole: process.env.NODE_ENV === 'production', // إزالة console.log في الإنتاج
  },

  // ===== إعدادات متقدمة =====
  experimental: {
    // ميزات Next.js التجريبية (غير ضرورية لمعظم المشاريع)
    serverActions: {},
    optimizePackageImports: ['@heroicons/react'], // مثال لتحسين استيراد المكتبات
  },

  // ===== إعدادات الأمان =====
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN',
        },
      ],
    },
  ],

  // ===== إعدادات التحسين =====
  productionBrowserSourceMaps: true, // لتصحيح الأخطاء في الإنتاج
}

// ===== الإضافات الاختيارية =====
const withPlugins = require('next-compose-plugins')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withPlugins([
  [withBundleAnalyzer],
  nextConfig
])