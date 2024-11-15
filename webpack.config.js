module.exports = {
//   presets: ["@babel/preset-env", "@babel/preset-react"],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      // ... Your other rules
    ],
  },
};
