import {cva, cx} from 'cva';
import type {ComponentProps} from 'react';

const buttonVariants = cva(
  'flex cursor-pointer items-center justify-center gap-1 rounded-md border px-0.75 text-sm disabled:cursor-default disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-gray-200 hover:bg-gray-100  disabled:hover:bg-transparent',
        primary:
          'border-purple-300 bg-purple-300 text-white hover:border-purple-400 hover:bg-purple-400 disabled:hover:border-purple-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type Props = ComponentProps<'button'> & {
  variant?: 'default' | 'primary';
};

export default function Button({className, children, variant, ...props}: Props) {
  return (
    <button className={cx(buttonVariants({variant}), className)} {...props}>
      {children}
    </button>
  );
}
