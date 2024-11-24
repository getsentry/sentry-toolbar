import {cx} from 'cva';
import {type UrlObject} from 'query-string';
import qs from 'query-string';
import {type MouseEvent} from 'react';

interface Props {
  children: React.ReactNode;
  to: UrlObject;
  onClick?: (event: MouseEvent) => void;
  className?: string;
}

const linkClass = cx('text-blue-400 hover:underline');

export default function ExternalLink({children, className, to, onClick}: Props) {
  const url = qs.stringifyUrl(to);

  return (
    <a href={url} onClick={onClick} rel="noreferrer noopener" target="_blank" className={className ?? linkClass}>
      {children}
    </a>
  );
}
