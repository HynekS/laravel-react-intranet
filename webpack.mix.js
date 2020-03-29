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

mix
  .options({
    //terser: {
    //  extractComments: false,
    //},
    hmrOptions: {
      host: "127.0.0.1",
      port: 8082,
    },
  })
  .react("resources/js/app.js", "public/js")
  .copyDirectory("resources/images/", "public/images/", false)
  // .bundleAnalyzer()
  .sourceMaps()
  .browserSync("localhost:8000")
