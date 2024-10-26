type HTMLTags = HTMLElementTagNameMap;

type ElementType<TagName> = TagName extends keyof HTMLTags
  ? HTMLElementTagNameMap[TagName]
  : HTMLElement;

export function select<TagName extends keyof HTMLTags | undefined = undefined>(
  parent: Element | Document,
  selector: string,
  _tagName?: TagName,
): ElementType<TagName> {
  return parent.querySelector(selector) as ElementType<TagName>;
}
