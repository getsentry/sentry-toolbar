import {Fragment} from 'react';
import type {ReactNode} from 'react';
import DebugState from 'toolbar/components/DebugState';

interface Props {
  children: ReactNode;
}

export default function CenterLayout({children}: Props) {
  return (
    <Fragment>
      <div className="fixed bottom-0 left-0 z-debug">
        <DebugState />
      </div>

      <div role="dialog" className="pointer-events-none fixed inset-0 flex place-items-center justify-center">
        {children}
      </div>
    </Fragment>
  );
}

CenterLayout.MainArea = function MainArea({children}: Props) {
  return <div className="pointer-events-auto flex">{children}</div>;
};
