import {cva} from 'cva';
import type {ReactNode} from 'react';

interface Props {
  size: 'mini' | 'normal';
  children?: ReactNode;
}

const spinnerClassName = cva(
  ['rounded-full', 'border-solid', 'border-gray-100', 'border-l-purple-300', 'animate-[spin_0.55s_linear_infinite]'],
  {
    variants: {
      size: {
        mini: ['w-3', 'h-3', 'border-2'],
        normal: ['w-16', 'h-16', 'border-[6px]'],
      },
    },
    defaultVariants: {
      size: 'normal',
    },
  }
);

export default function LoadingSpinner({children, size = 'normal'}: Props) {
  return <div className={spinnerClassName({size})}>{children}</div>;
}
