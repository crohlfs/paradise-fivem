export function waitFor(checkFn: () => boolean, timeout = 0) {
  return () =>
    new Promise(resolve => {
      (function check() {
        if (checkFn()) {
          resolve();
        } else {
          setTimeout(check, timeout);
        }
      })();
    });
}

export function noop() {}

export function delay(ms: number | undefined) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const cache = {};

export function getLabel(arg: string) {
  if (cache[arg] === undefined) cache[arg] = GetLabelText(arg);
  return cache[arg];
}
