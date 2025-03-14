import type {VariantProps} from 'cva';
import {cva} from 'cva';

const indicatorClass = cva(
  'absolute box-content flex size-[0.55rem] items-center justify-center rounded-full border border-transparent leading-4',
  {
    variants: {
      variant: {red: 'bg-red-400 text-gray-100'},
      position: {
        'top-right': 'right-0.25 top-0.25',
      },
    },
  }
);

export default function Indicator(props: VariantProps<typeof indicatorClass>) {
  return <div className={indicatorClass(props)} />;
}
