// dom microframework by charlotte

// deno-lint-ignore-file ban-types

export type ElementProps<E extends Element> = {
  [K in keyof E as E[K] extends Function ? never : K]?: E[K];
};

export function elem<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: ElementProps<HTMLElementTagNameMap[K]> | ElementProps<HTMLElementTagNameMap[K]>[] = {},
  children: (Element | string | Text)[] = [],
  extras: { classList?: string[] } = {},
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  Object.assign(element, attrs);
  if (extras.classList) extras.classList.forEach(c => element.classList.add(c));

  const nodes = children.map(e => (typeof e === "string" ? document.createTextNode(e) : e));
  element.append(...nodes);

  return element;
}
