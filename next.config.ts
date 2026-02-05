import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["nodemailer"],
  experimental: {
    optimizePackageImports: [
      "react-icons",
      "lucide-react",
      "mathjs",
      "framer-motion",
    ],
  },
};

export default nextConfig;
