const mix = require("laravel-mix")
require("laravel-mix-bundle-analyzer")
require("laravel-mix-react-typescript-extension")

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

const pathAliases = {
  "@hooks": path.join(__dirname, "resources/js/hooks"),
  "@store": path.join(__dirname, "resources/js/store"),
  "@services": path.join(__dirname, "resources/js/services"),
  "@utils": path.join(__dirname, "resources/js/utils"),
}

mix
  .webpackConfig({
    plugins: [removePlugin],
    resolve: {
      alias: {
        ...pathAliases,
      },
    },
    ...(mix.inProduction() && {
      resolve: {
        alias: {
          ...pathAliases,
          react: "preact/compat",
          "react-dom": "preact/compat",
        },
      },
      output: {
        chunkFilename: "[name].js?id=[chunkhash]",
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
  .reactTypeScript("resources/js/app.js", "public/js")
  .copyDirectory("resources/images/", "public/images/", false)
  .sourceMaps(false, "source-map")
  .browserSync("localhost:8000")

if (mix.inProduction()) {
  mix.version()
}
