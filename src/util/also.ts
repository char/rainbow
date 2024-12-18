// deno-lint-ignore-file no-explicit-any

function also<T>(this: T, f: (value: T) => any): T {
  f(this);
  return this;
}

function tap<T, R>(this: T, f: (value: T) => R): R {
  return f(this);
}

declare global {
  interface Object {
    also<T>(this: T, f: (value: T) => any): T;
    tap<T, R>(this: T, f: (value: T) => R): R;
  }
}

Object.defineProperty(Object.prototype, "also", { value: also, enumerable: false });
Object.defineProperty(Object.prototype, "tap", { value: tap, enumerable: false });
