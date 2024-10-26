// deno-lint-ignore-file no-explicit-any

function also<T>(this: T, f: (value: T) => any): T {
  f(this);
  return this;
}

declare global {
  interface Object {
    also<T>(this: T, f: (value: T) => any): T;
  }
}

Object.prototype.also = also;
