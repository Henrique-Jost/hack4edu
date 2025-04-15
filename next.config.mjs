/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  instrumentationHook: true, //langfuse trace
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
