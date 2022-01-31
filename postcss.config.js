const plugins = {
    'postcss-import': {},
    autoprefixer: {},
    // tailwindcss: {},
    'postcss-flexbugs-fixes': {},
    'postcss-preset-env': {
        autoprefixer: {
            flexbox: 'no-2009'
        },
        stage: 3,
        features: {
            'custom-properties': false
        }
    },
}

plugins['@fullhuman/postcss-purgecss'] = {
    content: [
        './src/components/**/*.js',
        './pages/**/*.js',
        './node_modules/swiper/react/*.js',
    ],
    defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || [],
    safelist: ["html", "body", "swiper", /^swiper/, "swiper-wrapper", "img[src]", "img[srcset]", /^swiper-slide/, /^mini-cart-anim/, /^columns--quiz/, /^shopbycolor__product/, /^form--login/, /^button-anim/]
  }

module.exports = {
    plugins
}
