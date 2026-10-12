import type { NextConfig } from "next";
import os from "os";

function getLocalIpAddresses(): string[] {
  const interfaces = os.networkInterfaces();
  const ips: string[] = [];
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        ips.push(net.address);
      }
    }
  }
  return ips;
}

const localIps = getLocalIpAddresses();

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    ...localIps,
    "192.168.1.22",
    "192.168.1.*",
    "192.168.*.*",
    "10.*.*.*",
    "172.*.*.*",
    "*.local",
    "localhost",
  ],
  experimental: {
    agentFeedback: true,
    serverActions: {
      allowedOrigins: [
        ...localIps.map((ip) => `${ip}:3000`),
        ...localIps,
        "192.168.1.22:3000",
        "192.168.1.22",
        "192.168.1.*:3000",
        "192.168.1.*",
        "192.168.*.*:3000",
        "192.168.*.*",
        "10.*.*.*:3000",
        "10.*.*.*",
        "localhost:3000",
        "localhost",
      ],
    },
  },
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
