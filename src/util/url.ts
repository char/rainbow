export type URLLike = string | URL;

function coerceURL(url: URLLike): URL {
  return new URL(url);
}

export function url(
  path: string,
  opts: { searchParams?: Record<string, string>; base?: URLLike } = {},
) {
  const url = new URL(path, opts.base?.tap(coerceURL));
  if (opts.searchParams)
    for (const [key, value] of Object.entries(opts.searchParams)) {
      url.searchParams.set(key, value);
    }

  return url;
}
