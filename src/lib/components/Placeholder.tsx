import {cva} from 'cva';

const Placeholder = cva('flex shrink-0 flex-col items-center justify-center rounded-md', {
  variants: {
    base: {
      true: ['w-full', 'h-14'],
    },
    shape: {
      square: ['rounded-md'],
      round: ['rounded-full'],
    },
    state: {
      normal: ['bg-surface-100'],
      error: ['text-red-200', 'bg-red-100'],
    },
  },
  defaultVariants: {
    base: true,
    shape: 'square',
    state: 'normal',
  },
});

export default Placeholder;
