import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['utfs.io'], // Add uploadthing's domain here
  },
};

export default withNextIntl(nextConfig);