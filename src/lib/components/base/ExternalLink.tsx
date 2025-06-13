import {cx} from 'cva';
import {type UrlObject} from 'query-string';
import qs from 'query-string';
import type {ForwardedRef} from 'react';
import {forwardRef, type MouseEvent} from 'react';
import {twMerge} from 'tailwind-merge';

interface Props {
  children: React.ReactNode;
  to: UrlObject;
  onClick?: (event: MouseEvent) => void;
  className?: string;
}

const linkClass = cx('text-blue-400 hover:underline');

const ExternalLink = forwardRef(function ExternalLink(
  {children, className, to, onClick}: Props,
  ref: ForwardedRef<HTMLAnchorElement>
) {
  const url = qs.stringifyUrl(to);

  return (
    <a
      ref={ref}
      href={url}
      onClick={onClick}
      rel="noreferrer noopener"
      target="_blank"
      className={twMerge(linkClass, className)}>
      {children}
    </a>
  );
});

export default ExternalLink;
