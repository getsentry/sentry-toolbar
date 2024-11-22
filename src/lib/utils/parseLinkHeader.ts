export type ParsedHeader =
  | undefined
  | {
      cursor: string;
      href: string;
      results: boolean | null;
    };

export default function parseLinkHeader(header: string | null): Record<string, ParsedHeader> {
  if (header === null || header === '') {
    return {};
  }

  const headerValues = header.split(',');
  const links: Record<string, ParsedHeader> = {};

  headerValues.forEach(val => {
    const match = /<([^>]+)>; rel="([^"]+)"(?:; results="([^"]+)")?(?:; cursor="([^"]+)")?/g.exec(val);
    if (!match) {
      return;
    }
    const [, href, rel, results, cursor] = match;
    const hasResults = results === 'true' ? true : results === 'false' ? false : null;

    if (!rel || !href || !cursor) {
      return;
    }
    links[rel] = {
      href,
      results: hasResults,
      cursor: cursor,
    };
  });

  return links;
}
