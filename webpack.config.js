module.exports = {
  mode: "production",
  entry: {
    character: "./src/character/index.ts"
  },
  resolve: {
    extensions: [".ts"]
  },
  output: {
    filename: "../server-data/resources/[local]/[name]/index.js"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env", { targets: { node: "8" } }],
              "@babel/preset-typescript"
            ]
          }
        }
      }
    ]
  }
};
