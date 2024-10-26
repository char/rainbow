export function setClass(element: Element, className: string, enabled: unknown) {
  if (enabled) element.classList.add(className);
  else element.classList.remove(className);
}
