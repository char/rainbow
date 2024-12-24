// deno-lint-ignore-file no-explicit-any

function tap<T>(this: T, f: (value: T) => any): T {
  f(this);
  return this;
}

function pipe<T, R>(this: T, f: (value: T) => R): R {
  return f(this);
}

declare global {
  interface Object {
    tap<T>(this: T, f: (value: T) => any): T;
    pipe<T, R>(this: T, f: (value: T) => R): R;
  }
}

Object.defineProperty(Object.prototype, "tap", { value: tap, enumerable: false });
Object.defineProperty(Object.prototype, "pipe", { value: pipe, enumerable: false });
