const MinimizerPlugin = require("minimizer-webpack-plugin");

module.exports = (env) => {
  const options = {
    entry: "./src/index.js",
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
