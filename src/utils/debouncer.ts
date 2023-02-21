export const debouncer = (callback: (value: any) => void, time = 40) => {
  let lastCalled = 0;
  let timeout: NodeJS.Timeout;

  return (value: any) => {
    const now = Date.now();
    clearTimeout(timeout);

    if (now - lastCalled > time) {
      callback(value);
      lastCalled = now;
    } else {
      timeout = setTimeout(() => {
        callback(value);
      }, time + 5);
    }
  };
};
