const mix = require("laravel-mix")
require("laravel-mix-bundle-analyzer")

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
*/

const RemovePlugin = require("remove-files-webpack-plugin")

const removePlugin = new RemovePlugin({
  before: {
    test: [
      {
        folder: "public",
        method: filePath => {
          return new RegExp(/(?:.*\.js|.*\.map|mix-manifest\.json)$/, "m").test(filePath)
        },
      },
      {
        folder: "public/js",
        method: filePath => {
          return new RegExp(/(?:.*\.js|.*\.map)$/, "m").test(filePath)
        },
        recursive: true,
      },
      {
        folder: "public/css",
        method: filePath => {
          return new RegExp(/(?:.*\.css|.*\.map)$/, "m").test(filePath)
        },
      },
    ],
  },

  after: {},
})

mix
  .webpackConfig({
    plugins: [removePlugin],
    ...(mix.inProduction && {
      resolve: {
        alias: {
          react: "preact/compat",
          "react-dom": "preact/compat",
        },
      },
    }),
  })
  .options({
    terser: {
      extractComments: false,
    },
    hmrOptions: {
      host: "127.0.0.1",
      port: 8082,
    },
  })
  .react("resources/js/app.js", "public/js")
  .copyDirectory("resources/images/", "public/images/", false)
  .sourceMaps(false, "source-map")
  .browserSync("localhost:8000")

if (mix.inProduction()) {
  mix.version()
  mix.bundleAnalyzer()
}
