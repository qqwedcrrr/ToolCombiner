
export default {
  config() {
    return {
      onError(err) {
        err.preventDefault();
        console.error(err.message);
      },
    };
  },
  plugins: [
    require('dva-logger'),
  ]
}
