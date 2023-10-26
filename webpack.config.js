module.exports = {
    resolve: {
      fallback: {
        http: require.resolve('stream-http'),
        path: require.resolve('path-browserify')
      }
    }
  };

