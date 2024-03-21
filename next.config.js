/** @type {import('next').NextConfig} */
const nextConfig = {
    // allow image from url https://lh3.googleusercontent.com/
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                port: "",
                pathname: "/**"
            }
        ]
    }
};

module.exports = nextConfig
