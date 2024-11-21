// ([:]([^/]*)) matches :param used by React, Vue, Angular, Express, Ruby on Rails, Phoenix, Solid
// ([[]([^/]*)[\]]) matches [param] used by Next.js, Nuxt.js, Svelte
// ([{]([^/]*)[}]) matches {param} used by ASP.NET Core, Laravel, Symfony
// ([<]([^/]*)[>]) matches <param> used by Flask, Django
const PARAMETERIZED_REGEX = /([/])(([:]([^/]*))|([[]([^/]*)[\]])|([{]([^/]*)[}])|([<]([^/]*)[>]))/g;

// Transaction name could contain the resolved URL instead of the route pattern
// (ie: actual `id` instead of `:id`) so we match any param that starts with a
// number eg. /12353
const NON_PARAMETERIZED_REGEX = /([/])([0-9]+)/g;

export default function transactionToSearchTerm(transaction: string) {
  // Find dynamic parts of transaction name to change into search term
  const modifiedTransaction = transaction
    .replaceAll(PARAMETERIZED_REGEX, '/*')
    .replaceAll(NON_PARAMETERIZED_REGEX, '/*');

  // Join the array back into a string with '/'
  return `/${modifiedTransaction}/`.replaceAll(/\/+/g, '/');
}
