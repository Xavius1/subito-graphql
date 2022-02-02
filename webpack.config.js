import path from 'path';

const conf = {
  mode: 'production',
  entry: './lib/index.js',
  output: {
    filename: 'subito-lib.js',
    path: path.resolve(__dirname, '/subito-graphql/dist'),
    // path: '/Users/xavierherriot/SoMAFAG/subito-lib/dist',
  },
  // resolve: {
  //   fallback: {
  //   },
  // },
};

export default conf;
