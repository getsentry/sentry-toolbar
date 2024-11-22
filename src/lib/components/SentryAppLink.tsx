import {cx} from 'cva';
import {type UrlObject} from 'query-string';
import qs from 'query-string';
import {useContext, type MouseEvent} from 'react';
import ConfigContext from 'toolbar/context/ConfigContext';

interface Props {
  children: React.ReactNode;
  to: UrlObject;
  onClick?: (event: MouseEvent) => void;
  className?: string;
}

const linkClass = cx('text-blue-400 hover:underline');

export default function SentryAppLink({children, className, to, onClick}: Props) {
  const {sentryOrigin} = useContext(ConfigContext);

  const url = qs.stringifyUrl({
    url: `${sentryOrigin}${to.url}`,
    query: to.query,
  });

  return (
    <a href={url} onClick={onClick} rel="noreferrer noopener" target="_blank" className={className ?? linkClass}>
      {children}
    </a>
  );
}
