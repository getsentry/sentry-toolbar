import {cva} from 'cva';
import {useState} from 'react';

interface Props<Keys extends string[]> {
  options: Record<Keys[number], {label: string}>;
  defaultSelected: Keys[number];
  onChange: (value: Keys[number]) => void;
}

const btnClassName = cva('rounded-md', {
  variants: {
    isSelected: {
      true: 'border-l bg-white font-medium first:border-l-0',
      false: 'border-l-0 bg-none font-normal',
    },
  },
  defaultVariants: {
    isSelected: false,
  },
});

export default function SegmentedControl<Keys extends string[]>({defaultSelected, options, onChange}: Props<Keys>) {
  const [selected, setSelected] = useState(defaultSelected);

  return (
    <div className="relative inline-grid min-w-0 grid-flow-col rounded-md border border-gray-200 bg-gray-100 text-xs leading-4">
      {Object.entries(options).map(entry => {
        const [key, value] = entry as [Keys[number], Props<Keys>['options'][Keys[number]]];
        const {label} = value;
        return (
          <button
            key={key}
            className={btnClassName({isSelected: selected === key})}
            onClick={e => {
              e.preventDefault();
              setSelected(key);
              onChange(key);
            }}>
            {label}
          </button>
        );
      })}
    </div>
  );
}
