const pckg = require('./package.json')

module.exports = api => {
  api.cache.using(() => process.env.NODE_ENV === 'development')

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          useBuiltIns: 'entry',
          corejs: {
            version: 3,
          },
          debug: false,
          targets: {
            browsers: pckg.browserslist,
          },
        },
      ],
    ],
    plugins: [
      '@babel/plugin-transform-runtime',
      [
        'module-resolver',
        {
          root: ['./src'],
        },
      ],
    ],
  }
}
