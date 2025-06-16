import {cva} from 'cva';
import type {ReactNode} from 'react';

interface Props {
  size: 'mini' | 'normal';
  children?: ReactNode;
}

const spinnerClassName = cva(
  'animate-[spin_0.55s_linear_infinite] rounded-full border-solid border-gray-100 border-l-purple-300',
  {
    variants: {
      size: {
        mini: 'size-3 border-2',
        normal: 'size-16 border-[6px]',
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
