export const debounce = (cb, delay = 200) => {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args);
    }, delay);
  };
};

export const elementExistsIn = (selectorString, parent) => {
  if (parent === null) return false;

  return parent.querySelector(selectorString) === null ? false : true;
};
