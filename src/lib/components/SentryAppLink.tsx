import qs, {type UrlObject} from 'query-string';
import {type MouseEvent, useContext} from 'react';
import {ConfigContext} from 'toolbar/context/ConfigContext';

interface Props {
  children: React.ReactNode;
  to: UrlObject;
  onClick?: (event: MouseEvent) => void;
}

/**
 * Inline link to orgSlug.sentry.io/{to}.
 */
export default function SentryAppLink({children, to}: Props) {
  const {organizationIdOrSlug} = useContext(ConfigContext);

  const url = qs.stringifyUrl({
    url: `https://${organizationIdOrSlug}.sentry.io${to.url}`,
    query: to.query,
  });

  return (
    <a href={url} rel="noreferrer noopener" target="_blank">
      {children}
    </a>
  );
}
