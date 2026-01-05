/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, // Prevents double-mounting effects which breaks WebRTC/Sockets in dev
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                stream: require.resolve('stream-browserify'),
                buffer: require.resolve('buffer'),
                util: require.resolve('util'),
                events: require.resolve('events'),
                process: false,
                fs: false,
                net: false,
                tls: false,
            };

            // Add ProvidePlugin
            const webpack = require('webpack');
            config.plugins.push(
                new webpack.ProvidePlugin({
                    process: 'process/browser',
                    Buffer: ['buffer', 'Buffer'],
                })
            );
        }
        return config;
    },
};

module.exports = nextConfig;
