let tick = new Map<number, Function>();
let currentHandle = 0;

export function addTick(t: Function) {
  tick.set(currentHandle, t);

  if (currentHandle === 0) {
    setTick(() => {
      for (const t of tick!.values()) {
        t();
      }
    });
  }
  return currentHandle++;
}

export function clearTick(handle: number) {
  tick.delete(handle);
}
