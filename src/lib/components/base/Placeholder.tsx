import {cva, type VariantProps} from 'cva';
import {twMerge} from 'tailwind-merge';

const placeholderClass = cva('flex shrink-0 flex-col items-center justify-center rounded-md', {
  variants: {
    height: {
      full: 'h-full',
      auto: 'h-auto',
      text: 'h-[1rem]',
      small: 'h-2',
      medium: 'h-3',
      large: 'h-4',
    },
    width: {
      full: 'w-full',
      auto: 'w-auto',
      small: 'w-2',
      medium: 'w-3',
      large: 'w-4',
    },
    shape: {
      square: 'rounded-md',
      round: 'rounded-full',
    },
    state: {
      normal: 'bg-gray-100',
      error: 'bg-red-100 text-red-200',
    },
  },
  defaultVariants: {
    height: 'text',
    width: 'full',
    shape: 'square',
    state: 'normal',
  },
});

export default function Placeholder({
  className,
  ...props
}: VariantProps<typeof placeholderClass> & React.ComponentProps<'div'>) {
  return <div className={twMerge(placeholderClass(props), className)} {...props} />;
}
