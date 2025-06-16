import {cva} from 'cva';

const Placeholder = cva('flex shrink-0 flex-col items-center justify-center rounded-md', {
  variants: {
    base: {
      true: 'h-14 w-full',
    },
    shape: {
      square: 'rounded-md',
      round: 'rounded-full',
    },
    state: {
      normal: 'bg-surface-100',
      error: 'bg-red-100 text-red-200',
    },
  },
  defaultVariants: {
    base: true,
    shape: 'square',
    state: 'normal',
  },
});

export default Placeholder;
