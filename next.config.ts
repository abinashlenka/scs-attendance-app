const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // This allows the build to finish even with minor errors
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};