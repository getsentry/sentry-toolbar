import {cx} from 'cva';
import type {DetailedHTMLProps, InputHTMLAttributes} from 'react';

export default function Input({
  className,
  ...props
}: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cx(
        'w-full resize-y rounded-md border bg-white p-0.75 pl-1 text-xs text-gray-400 transition-[border,box-shadow] duration-100 focus:border-purple-300 focus:outline-none',
        className
      )}
    />
  );
}
