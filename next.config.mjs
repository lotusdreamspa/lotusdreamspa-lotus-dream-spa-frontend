/** @type {import('next').NextConfig} */

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin(
  './i18n/request.ts' // <-- Se non hai 'src', togli 'src/' dal path
);
const nextConfig = {  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
        {
        protocol: 'https',
        hostname: 'strapi-production-cfe0.up.railway.app',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-004ec797aa4742aab6b3c705799bba0c.r2.dev',
      },
    ],
  }};

export default withNextIntl(nextConfig);
