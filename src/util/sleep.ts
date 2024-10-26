export function sleep(timeoutMs: number): Promise<void> {
  return new Promise(res => setTimeout(res, timeoutMs));
}

export function sleepFrame(): Promise<void> {
  return new Promise(res => requestAnimationFrame(() => res()));
}

export function sleepTick(): Promise<void> {
  return new Promise(res => queueMicrotask(res));
}
