import {cva} from 'cva';
import {type MouseEvent} from 'react';

interface Props {
  isActive: boolean;
  onClick: (event: MouseEvent) => void;
  size: 'sm' | 'lg';
}

const btnClassName = cva(
  [
    'relative',
    'inline-block',
    'rounded-full',
    'border',
    'bg-white',
    'p-0',
    'transition-[border,box-shadow]',
    'duration-100',
    'focus:border-purple-300',
  ],
  {
    variants: {
      size: {
        sm: ['h-2', 'w-4'],
        lg: ['h-[24px]', 'w-[45px]'],
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  }
);

const nubClassName = cva(['absolute', 'rounded-full', 'transition'], {
  variants: {
    size: {
      sm: ['top-px', 'size-1.5'],
      lg: ['top-[3px]', 'size-2'],
    },
    isActive: {
      true: ['bg-purple-400'],
      false: ['bg-gray-100'],
    },
  },
  compoundVariants: [
    {size: 'sm', isActive: true, class: 'translate-x-0'},
    {size: 'sm', isActive: false, class: '-translate-x-1.5'},
    {size: 'lg', isActive: true, class: 'translate-x-[3px]'},
    {size: 'lg', isActive: false, class: 'translate-x-[-19px]'},
  ],

  defaultVariants: {
    size: 'lg',
    isActive: false,
  },
});

export default function SwitchButton({isActive, onClick, size}: Props) {
  return (
    <button className={btnClassName({size})} onClick={onClick}>
      <span className={nubClassName({isActive, size})} />
    </button>
  );
}
