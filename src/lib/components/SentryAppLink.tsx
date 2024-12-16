import {type UrlObject} from 'query-string';
import {useContext, type MouseEvent} from 'react';
import ExternalLink from 'toolbar/components/base/ExternalLink';
import ConfigContext from 'toolbar/context/ConfigContext';
import {getSentryWebOrigin} from 'toolbar/sentryApi/urls';

interface Props {
  children: React.ReactNode;
  to: UrlObject;
  onClick?: (event: MouseEvent) => void;
  className?: string;
}

export default function SentryAppLink({children, className, to, onClick}: Props) {
  const config = useContext(ConfigContext);

  return (
    <ExternalLink
      to={{
        url: `${getSentryWebOrigin(config)}${to.url}`,
        query: to.query,
      }}
      onClick={onClick}
      className={className}>
      {children}
    </ExternalLink>
  );
}
