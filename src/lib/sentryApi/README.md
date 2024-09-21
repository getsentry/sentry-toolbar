The types in this folder are meant to be in sync with the types found at https://github.com/getsentry/sentry/tree/master/static/app/types

Because those types are not exported by sentry in any way we will instead do a best-effort code-generation in this repo to generate a list of all the fields that the API returns. The generated types appear in the `raw/` folder.

To re-generate the types, run `pnpm generate:api-types` from the root of the repo.

Often the auto-generated types will not be perfect, so we have the `types/` folder as an extra layer where we can manually augment the types to make them more usable for this project.
