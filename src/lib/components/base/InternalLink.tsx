import {cx} from 'cva';
import type {ComponentProps} from 'react';
import {Link} from 'react-router-dom';
import {twMerge} from 'tailwind-merge';

interface Props extends Omit<ComponentProps<typeof Link>, 'to'> {
  children: React.ReactNode;
  to: string;
  className?: string;
}

const linkClass = cx('text-blue-400 hover:underline');

export default function InternalLink({children, className, to, ...props}: Props) {
  return (
    <Link {...props} to={to} className={twMerge(linkClass, className)}>
      {children}
    </Link>
  );
}
