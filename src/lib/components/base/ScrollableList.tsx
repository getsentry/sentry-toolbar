import {cx} from 'cva';
import type {CSSProperties} from 'react';

interface Props {
  children: React.ReactNode;
  ref?: React.RefObject<HTMLDivElement | null> | undefined;
  height?: number | undefined;
  transform?: CSSProperties['transform'] | undefined;
}

export default function ScrollableList({children, ref, height, transform}: Props) {
  return (
    <div ref={ref} className="flex size-full flex-col overflow-auto overscroll-contain contain-strict">
      <div style={{height}} className="relative flex w-full flex-col">
        <ul style={{transform}} className={cx('w-full', {'absolute left-0 top-0': transform})}>
          {children}
        </ul>
      </div>
    </div>
  );
}
