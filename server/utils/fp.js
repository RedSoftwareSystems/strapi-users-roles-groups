module.exports =
  (fn) =>
  (...args) =>
    fn.bind(null, ...args);
