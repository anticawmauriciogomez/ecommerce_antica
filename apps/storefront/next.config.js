// apps/storefront/next.config.js
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Required for some Next.js 16/Turbopack setups with next-intl
    experimental: {
        // any experimental flags here
    },
    turbopack: {},
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
};

export default withNextIntl(nextConfig);