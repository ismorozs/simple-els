const MinimizerPlugin = require("minimizer-webpack-plugin");

module.exports = (env) => {
  const options = {
    entry: "./src/index.ts",
    output: {
      filename: "simple-els.js",
      library: "SimpleEls",
      libraryTarget: "umd",
      libraryExport: "default",
      globalObject: "this",
    },
    mode: "development",
    watch: true,

    stats: {
      colors: true,
    },

    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/i,
          loader: "ts-loader",
          exclude: ["/node_modules/"],
        },
      ],
    },

    resolve: {
      extensions: [".ts", ".js"],
    },

    devtool: false,
  };

  if (env.production) {
    options.optimization = {
      minimize: true,
      minimizer: [new MinimizerPlugin()],
    };
    options.output.filename = "simple-els.min.js";
  }

  return options;
};
