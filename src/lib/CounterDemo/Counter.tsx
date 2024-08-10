import type {FC} from 'react';
import {useEffect} from 'react';

import useLogic from './useLogic';

export type Props = {
    /** Set initial value */
    initialValue?: number;
};

export const Counter: FC<Props> = ({initialValue = 0}) => {
    const {count, incrementCount} = useLogic(initialValue);

    useEffect(() => {
        const timeout = setTimeout(() => {
            console.log('did mount and wait 10ms');
        }, 10);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="w-60 border border-slate-300 p-6 text-center">
            <h2 className="mb-3 text-2xl">Counter</h2>
            <button
                className="mb-6 rounded-lg bg-teal-600 px-6 py-3 text-base text-white drop-shadow-md active:relative active:left-0.5 active:top-0.5 active:drop-shadow-none"
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
