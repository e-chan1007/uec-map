import withYAML from "next-plugin-yaml";

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  async rewrites() {
    return {
      beforeFiles: [{
        source: "/ogc/:path*",
        has: [{
          type: "query",
          key: "f",
          value: "html"
        }],
        destination: "/ogc-html/:path*"
      }]
    };
  },
  async headers() {
    return [
      {
        source: "/ogc/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "Accept, Accept-Version, Content-Length, Content-Type, Date" },
          { key: "Cache-Control", value: "max-age=86400, stale-while-revalidate=3600" }
        ]
      }
    ];
  },
  webpack: config => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });
    return config;
  },
  eslint: { ignoreDuringBuilds: true }
};

export default withYAML(nextConfig);
