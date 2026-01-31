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
    ],
  }};

export default withNextIntl(nextConfig);
