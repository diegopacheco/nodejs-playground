
export const utils = {
  log: (msg) => console.log('[Utils] ' + msg),
  format: (str) => str.toUpperCase(),
  debounce: (fn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(null, args), delay);
    };
  }
};
      