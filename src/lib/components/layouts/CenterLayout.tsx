import type {ReactNode} from 'react';

interface Props {
  children: ReactNode;
}

export default function CenterLayout({children}: Props) {
  return (
    <div className="pointer-events-none fixed inset-0 z-debug flex place-items-center justify-center">{children}</div>
  );
}

CenterLayout.MainArea = function MainArea({children}: Props) {
  return (
    <div role="dialog" className="flex overscroll-contain contain-layout">
      {children}
    </div>
  );
};
