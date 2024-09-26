import {Fragment} from 'react';
import type {ReactNode} from 'react';
import DebugState from 'toolbar/components/DebugState';

interface Props {
  children: ReactNode;
}

export default function RightEdgeLayout({children}: Props) {
  return (
    <Fragment>
      <div className="fixed bottom-0 left-0 z-debug">
        <DebugState />
      </div>

      <div
        role="dialog"
        className="pointer-events-none fixed inset-0 grid grid-cols-[1fr_max-content] items-center gap-[10px] [grid-template-areas:'main_nav']">
        {children}
      </div>
    </Fragment>
  );
}

RightEdgeLayout.NavArea = function NavArea({children}: Props) {
  return <div className="pointer-events-auto flex pr-2 [grid-area:nav]">{children}</div>;
};
RightEdgeLayout.MainArea = function MainArea({children}: Props) {
  return <div className="pointer-events-auto flex justify-self-end [grid-area:main]">{children}</div>;
};
