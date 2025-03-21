import {cva, cx} from 'cva';
import {Fragment} from 'react';
import type {ReactNode} from 'react';
import type {Configuration} from 'toolbar/types/Configuration';

interface Props {
  children: ReactNode;
}

const layoutClass = cva(
  [
    "pointer-events-none fixed inset-0 z-debug grid grid-cols-[1fr_max-content] gap-2 p-2 [grid-template-areas:'main_nav']",
  ],
  {
    variants: {
      placement: {
        'right-edge': ['items-center'],
        'bottom-right-corner': ['items-end'],
      },
    },
    defaultVariants: {
      placement: 'right-edge',
    },
  }
);

export default function EdgeLayout({children, placement}: Props & {placement: Configuration['placement']}) {
  return (
    <Fragment>
      <div className={layoutClass({placement})}>{children}</div>
    </Fragment>
  );
}

const areaCss = cx(
  'flex rounded-xl border border-translucentGray-200 bg-white text-black shadow-lg shadow-shadow-heavy overscroll-contain'
);

EdgeLayout.NavArea = function NavArea({children}: Props) {
  return (
    <div role="dialog" className="pointer-events-auto contain-layout [grid-area:nav]">
      <div className={areaCss}>{children}</div>
    </div>
  );
};
EdgeLayout.MainArea = function MainArea({children}: Props) {
  return (
    <div role="dialog" className="pointer-events-auto justify-self-end contain-layout [grid-area:main]">
      <div className={cx('h-[90vh] max-h-[560px] w-[320px] max-w-[320px] contain-size', areaCss)}>{children}</div>
    </div>
  );
};
