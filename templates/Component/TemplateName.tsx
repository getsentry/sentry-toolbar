import {throttle} from 'lodash';
import {useEffect} from 'react';
import useLogic from 'toolbar/../../templates/Component/useLogic';

export interface Props {
  /** Set initial value */
  initialValue?: number;
}

export default function TemplateName({initialValue = 0}: Props) {
  const {count, incrementCount} = useLogic(initialValue);

  useEffect(() => {
    const runner = throttle(() => {
      console.log('throttle');
    }, 10);
    runner();
  }, []);
  return (
    <div className="border-slate-300 w-60 border p-6 text-center">
      <h2 className="mb-3 text-2xl">Counter</h2>
      <button
        className="bg-teal-600 text-white mb-6 rounded-lg px-6 py-3 text-base drop-shadow-md active:relative active:left-0.5 active:top-0.5 active:drop-shadow-none"
        type="button"
        onClick={incrementCount}>
        Increment by one
      </button>
      <div>
        Total value: <strong>{count}</strong>
      </div>
    </div>
  );
}
