/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  instrumentationHook: true, //lanfuse trace
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
