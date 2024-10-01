import {Fragment, useContext} from 'react';
import type {ReactNode} from 'react';
import DebugState from 'toolbar/components/DebugState';
import ConfigContext from 'toolbar/context/ConfigContext';

interface Props {
  children: ReactNode;
}

export default function CenterLayout({children}: Props) {
  const {debug} = useContext(ConfigContext);
  return (
    <Fragment>
      {debug ? (
        <div className="fixed bottom-0 left-0 z-debug">
          <DebugState />
        </div>
      ) : null}

      <div className="pointer-events-none fixed inset-0 flex place-items-center justify-center">{children}</div>
    </Fragment>
  );
}

CenterLayout.MainArea = function MainArea({children}: Props) {
  return (
    <div role="dialog" className="pointer-events-auto flex overscroll-contain contain-layout">
      {children}
    </div>
  );
};
