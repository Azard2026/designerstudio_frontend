import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces a minimal production runtime image for the EC2 server.
  output: "standalone",
};

export default nextConfig;
