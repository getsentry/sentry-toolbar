import {FloatingPortal} from '@floating-ui/react';
import type {ReactNode} from 'react';

interface Props {
  children: ReactNode;
  portalMount: HTMLElement;
}

export default function Providers({children, portalMount}: Props) {
  return <FloatingPortal root={portalMount}>{children}</FloatingPortal>;
}
