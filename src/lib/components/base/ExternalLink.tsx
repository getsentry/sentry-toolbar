import {cx} from 'cva';
import {type UrlObject} from 'query-string';
import qs from 'query-string';
import type {ComponentProps} from 'react';
import {type MouseEvent} from 'react';
import {twMerge} from 'tailwind-merge';

interface Props extends ComponentProps<'a'> {
  children: React.ReactNode;
  to: UrlObject;
  onClick?: (event: MouseEvent) => void;
  className?: string;
}

const linkClass = cx('text-blue-400 hover:underline');

export default function ExternalLink({children, className, to, onClick, ...props}: Props) {
  const url = qs.stringifyUrl(to);

  return (
    <a
      {...props}
      href={url}
      onClick={onClick}
      rel="noreferrer noopener"
      target="_blank"
      className={twMerge(linkClass, className)}>
      {children}
    </a>
  );
}
