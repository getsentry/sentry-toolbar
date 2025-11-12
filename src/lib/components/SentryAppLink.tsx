import {type UrlObject} from 'query-string';
import type {ComponentProps} from 'react';
import {type MouseEvent} from 'react';
import ExternalLink from 'toolbar/components/base/ExternalLink';
import {useConfigContext} from 'toolbar/context/ConfigContext';
import {getSentryWebOrigin} from 'toolbar/sentryApi/urls';

export interface Props extends ComponentProps<typeof ExternalLink> {
  children: React.ReactNode;
  to: UrlObject;
  onClick?: (event: MouseEvent) => void;
  className?: string;
}

export default function SentryAppLink({children, className, to, onClick, ...props}: Props) {
  const [config] = useConfigContext();

  return (
    <ExternalLink
      {...props}
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
