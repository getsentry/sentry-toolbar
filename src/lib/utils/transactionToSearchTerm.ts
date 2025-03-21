// (:[^/:]+) matches `:param` used by React, Vue, Angular, Express, Ruby on Rails, Phoenix, Solid
// (\[[^/\]]+\]) matches `[param]` used by Next.js, Nuxt.js, Svelte
// (\[\[[^/\]]+\]\]) matches `[[param]]` used by SvelteKit
// ({[^/}]+}) matches `{param}` used by ASP.NET Core, Laravel, Symfony
// (<[^>/]+>) matches `<param>` used by Flask, Django
const PARAMETERIZED_REGEX = /^((:[^/:]+)|(\[[^/\]]+\])|(\[\[[^/\]]+\]\])|({[^/}]+})|(<[^>/]+>))$/;

// Transaction name could contain the resolved URL instead of the route pattern
// (ie: actual `id` instead of `:id`) so we match any param that is a number.
const NON_PARAMETERIZED_REGEX = /^[0-9]+$/;

// Match an RFC4122 UUID, any version from 1-5 including the NIL UUID.
// With or without groups separated by `-`
// See: https://stackoverflow.com/a/13653180
// See: https://www.rfc-editor.org/rfc/rfc4122#section-4.1.7
const UUID_REGEX = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-5][0-9a-f]{3}-?[089ab][0-9a-f]{3}-?[0-9a-f]{12}$/i;

export default function transactionToSearchTerm(transaction: string) {
  // Find dynamic parts of transaction name to change into search term
  const parts = transaction
    .split('/')
    .map(segment =>
      segment.replace(PARAMETERIZED_REGEX, '*').replace(NON_PARAMETERIZED_REGEX, '*').replace(UUID_REGEX, '*')
    );

  // Join the array back into a string with '/'
  return parts.join('/').replace(/\/{2,}/, '/');
}
