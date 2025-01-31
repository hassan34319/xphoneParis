/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    domains: ["flowbite.com", "image.noelshack.com", "www.noelshack.com", "res.cloudinary.com","cdn.sanity.io", "fiverr-res.cloudinary.com","www.backmarket.be","m.media-amazon.com","www.pngall.com","www.rueducommerce.fr"],
  },
  redirects() {
    return [
      process.env.MAINTENANCE_MODE === "1"
        ? {
            source: "/((?!maintenance).*)",
            destination: "/maintenance",
            permanent: false,
          }
        : null,
    ].filter(Boolean);
  },
 };
 
 module.exports = nextConfig;