import {useEffect} from 'react';
import type {FC} from 'react';
import useLogic from 'toolbar/CounterDemo/useLogic';

export interface Props {
  /** Set initial value */
  initialValue?: number;
}

export const Counter: FC<Props> = ({initialValue = 0}) => {
  const {count, incrementCount} = useLogic(initialValue);

  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('did mount and wait 10ms');
    }, 10);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="w-100 border border-surface-300 p-4 text-center">
      <h2 className="mb-3 text-2xl">Counter</h2>
      <button
        className="mb-4 rounded-lg bg-blue-400 px-4 py-3 text-base text-white drop-shadow-md active:relative active:left-0.5 active:top-0.5 active:drop-shadow-none"
        type="button"
        onClick={incrementCount}>
        Increment by one
      </button>
      <div>
        Total value: <strong>{count}</strong>
      </div>
    </div>
  );
};
