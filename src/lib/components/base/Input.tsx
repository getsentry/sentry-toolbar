import {cva, cx} from 'cva';
import type {DetailedHTMLProps, InputHTMLAttributes} from 'react';

const inputClass = cva(
  'w-full resize-y rounded-md border p-0.75 pl-1 text-xs  transition-[border,box-shadow] duration-100 focus:border-purple-300 focus:outline-none',
  {
    variants: {
      disabled: {
        true: ['bg-translucentSurface-100', 'text-gray-300'],
        false: ['bg-white', 'text-gray-400'],
      },
    },
    defaultVariants: {
      disabled: false,
    },
  }
);

export default function Input({
  className,
  ...props
}: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
  return <input {...props} className={cx(inputClass(props), className)} />;
}
