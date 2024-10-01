import {type UrlObject} from 'query-string';
import qs from 'query-string';
import {useContext, type MouseEvent} from 'react';
import ConfigContext from 'toolbar/context/ConfigContext';

interface Props {
  children: React.ReactNode;
  to: UrlObject;
  onClick?: (event: MouseEvent) => void;
}

export default function SentryAppLink({children, to, onClick}: Props) {
  const {organizationIdOrSlug} = useContext(ConfigContext);

  const url = qs.stringifyUrl({
    url: `https://${organizationIdOrSlug}.sentry.io${to.url}`,
    query: to.query,
  });

  return (
    <a href={url} onClick={onClick} rel="noreferrer noopener" target="_blank" className="text-blue-400">
      {children}
    </a>
  );
}
