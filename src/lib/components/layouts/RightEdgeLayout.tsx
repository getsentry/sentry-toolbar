import {cx} from 'cva';
import {Fragment} from 'react';
import type {ReactNode} from 'react';

interface Props {
  children: ReactNode;
}

export default function RightEdgeLayout({children}: Props) {
  return (
    <Fragment>
      <div className="pointer-events-none fixed inset-0 z-debug grid grid-cols-[1fr_max-content] items-center gap-[10px] [grid-template-areas:'main_nav']">
        {children}
      </div>
    </Fragment>
  );
}

const areaCss = cx(
  'flex rounded-xl border border-translucentGray-200 bg-white text-black shadow-lg shadow-shadow-heavy overscroll-contain'
);

RightEdgeLayout.NavArea = function NavArea({children}: Props) {
  return (
    <div role="dialog" className="pointer-events-auto pr-2 contain-layout [grid-area:nav]">
      <div className={areaCss}>{children}</div>
    </div>
  );
};
RightEdgeLayout.MainArea = function MainArea({children}: Props) {
  return (
    <div role="dialog" className="pointer-events-auto justify-self-end contain-layout [grid-area:main]">
      <div className={cx('h-[90vh] max-h-[560px] w-[320px] max-w-[320px] contain-size', areaCss)}>{children}</div>
    </div>
  );
};
