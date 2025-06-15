import {type UrlObject} from 'query-string';
import type {ForwardedRef} from 'react';
import {forwardRef, type MouseEvent} from 'react';
import ExternalLink from 'toolbar/components/base/ExternalLink';
import {useConfigContext} from 'toolbar/context/ConfigContext';
import {getSentryWebOrigin} from 'toolbar/sentryApi/urls';

export interface Props {
  children: React.ReactNode;
  to: UrlObject;
  onClick?: (event: MouseEvent) => void;
  className?: string;
}

const SentryAppLink = forwardRef(function SentryAppLink(
  {children, className, to, onClick}: Props,
  ref: ForwardedRef<HTMLAnchorElement>
) {
  const [config] = useConfigContext();

  return (
    <ExternalLink
      ref={ref}
      to={{
        url: `${getSentryWebOrigin(config)}${to.url}`,
        query: to.query,
      }}
      onClick={onClick}
      className={className}>
      {children}
    </ExternalLink>
  );
});

export default SentryAppLink;
