import {NavLink} from 'react-router-dom';
import IconButton from 'toolbar/components/navigation/IconButton';

import type {ComponentProps, ReactNode} from 'react';

interface Props extends ComponentProps<typeof NavLink> {
  icon: ReactNode;
  label: string;
  children?: ReactNode;
}

export default function NavButton({children, icon, label, to}: Props) {
  return (
    <NavLink to={to}>
      <IconButton icon={icon} title={label}>
        {children}
      </IconButton>
    </NavLink>
  );
}
