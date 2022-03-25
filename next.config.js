const path = require("path");
const allowedImageWordPressDomain = new URL(process.env.NEXT_PUBLIC_WORDPRESS_URL).hostname

module.exports = {
    trailingSlash: true,
    webpackDevMiddleware: (config) => {
        config.watchOptions = {
            poll: 1000,
            aggregateTimeout: 300,
        };

        return config;
    },
    sassOptions: {
        includePaths: [path.join(__dirname, "styles")],
        prependData: `@import "../commons/variables";`
    },
    cssLoaderOptions: {
        localIdentName: process.env.NODE_ENV === 'production' ? '[hash:base64]' : '[local]--[hash:base64:5]',
    },
    /**
     * We specify which domains are allowed to be optimized.
     * This is needed to ensure that external urls can't be abused.
     * @see https://nextjs.org/docs/basic-features/image-optimization#domains
     */
    images: {
        domains: [ allowedImageWordPressDomain, 'via.placeholder.com' ],
    },
    generateBuildId: async () => {
    // You can, for example, get the latest git commit hash here
        return 'pbf'
    },
    compiler: {
    // ssr and displayName are configured by default
        styledComponents: true,
    },
    swcMinify: true,
};
