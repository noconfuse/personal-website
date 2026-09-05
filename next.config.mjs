/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
    output: 'export',              // ← add this
    images: { unoptimized: true },
};
export default nextConfig;
