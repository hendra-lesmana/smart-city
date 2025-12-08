/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        // Fix for maplibre-gl
        config.module.rules.push({
            test: /\.mjs$/,
            include: /node_modules/,
            type: "javascript/auto",
        });
        return config;
    },
};

export default nextConfig;
