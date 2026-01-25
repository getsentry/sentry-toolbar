import {cva, cx} from 'cva';
import type {ComponentProps} from 'react';

const selectVariants = cva(
  'flex cursor-pointer items-center justify-center gap-1 rounded-md border px-0.75 text-sm disabled:cursor-default disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-gray-200 text-black hover:bg-gray-100 hover:text-black disabled:hover:bg-transparent',
        primary:
          'border-purple-300 bg-purple-300 text-white hover:border-purple-400 hover:bg-purple-400 hover:text-white disabled:hover:border-purple-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface Props extends ComponentProps<'select'> {
  variant?: 'default' | 'primary';
}

export default function Select({className, children, variant, ...props}: Props) {
  return (
    <select className={cx(selectVariants({variant}), className)} {...props}>
      {children}
    </select>
  );
}
