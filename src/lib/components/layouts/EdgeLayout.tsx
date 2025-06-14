import {cva, cx} from 'cva';
import type {ReactNode} from 'react';
import type {Configuration} from 'toolbar/types/Configuration';

interface Props {
  children: ReactNode;
  placement: Configuration['placement'];
}

const layoutClass = cva(['pointer-events-none fixed inset-0 z-debug grid gap-2 p-2  '], {
  variants: {
    placement: {
      'top-left-corner': ['grid-rows-[max-content_1fr]', "[grid-template-areas:'nav''main']", 'items-start'],
      'top-edge': ['grid-rows-[max-content_1fr]', "[grid-template-areas:'nav''main']", 'items-center'],
      'top-right-corner': ['grid-rows-[max-content_1fr]', "[grid-template-areas:'nav''main']", 'items-end'],
      'bottom-left-corner': ['grid-rows-[1fr_max-content]', "[grid-template-areas:'main''nav']", 'items-start'],
      'bottom-edge': ['grid-rows-[1fr_max-content]', "[grid-template-areas:'main''nav']", 'items-center'],
      'bottom-right-corner': ['grid-rows-[1fr_max-content]', "[grid-template-areas:'main''nav']", 'items-end'],
      'left-top-corner': ['grid-cols-[max-content_1fr]', "[grid-template-areas:'nav_main']", 'items-start'],
      'left-edge': ['grid-cols-[max-content_1fr]', "[grid-template-areas:'nav_main']", 'items-center'],
      'left-bottom-corner': ['grid-cols-[max-content_1fr]', "[grid-template-areas:'nav_main']", 'items-end'],
      'right-top-corner': ['grid-cols-[1fr_max-content]', "[grid-template-areas:'main_nav']", 'items-start'],
      'right-edge': ['grid-cols-[1fr_max-content]', "[grid-template-areas:'main_nav']", 'items-center'],
      'right-bottom-corner': ['grid-cols-[1fr_max-content]', "[grid-template-areas:'main_nav']", 'items-end'],
    },
  },
});

const navAreaClass = cva(['pointer-events-auto', 'contain-layout', '[grid-area:nav]'], {
  variants: {
    placement: {
      'top-left-corner': ['justify-self-start'],
      'top-edge': ['justify-self-center'],
      'top-right-corner': ['justify-self-end'],
      'bottom-left-corner': ['justify-self-start'],
      'bottom-edge': ['justify-self-center'],
      'bottom-right-corner': ['justify-self-end'],
      'left-top-corner': [],
      'left-edge': [],
      'left-bottom-corner': [],
      'right-top-corner': [],
      'right-edge': [],
      'right-bottom-corner': [],
    },
  },
});

const mainAreaClass = cva(['pointer-events-auto', 'contain-layout', '[grid-area:main]'], {
  variants: {
    placement: {
      'top-left-corner': ['justify-self-start', 'self-start'],
      'top-edge': ['justify-self-center', 'self-start'],
      'top-right-corner': ['justify-self-end', 'self-start'],
      'bottom-left-corner': ['justify-self-start', 'self-end'],
      'bottom-edge': ['justify-self-center', 'self-end'],
      'bottom-right-corner': ['justify-self-end', 'self-end'],
      'left-top-corner': ['justify-self-start'],
      'left-edge': ['justify-self-start'],
      'left-bottom-corner': ['justify-self-start'],
      'right-top-corner': ['justify-self-end'],
      'right-edge': ['justify-self-end'],
      'right-bottom-corner': ['justify-self-end'],
    },
  },
});

export default function EdgeLayout({children, placement}: Props) {
  return <div className={layoutClass({placement})}>{children}</div>;
}

const areaCss = cx(
  'flex rounded-xl border border-translucentGray-200 bg-white text-black shadow-lg shadow-shadow-heavy overscroll-contain'
);

export function NavArea({children, placement}: Props) {
  return (
    <div role="dialog" className={navAreaClass({placement})}>
      <div className={areaCss}>{children}</div>
    </div>
  );
}
export function MainArea({children, placement}: Props) {
  return (
    <div role="dialog" className={mainAreaClass({placement})}>
      <div className={cx('h-[90vh] max-h-[560px] w-[320px] max-w-[320px] contain-size', areaCss)}>{children}</div>
    </div>
  );
}
