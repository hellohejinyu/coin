const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  output: {
    filename: '[name].js',
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'source', to: '.' }],
    }),
  ],
}
