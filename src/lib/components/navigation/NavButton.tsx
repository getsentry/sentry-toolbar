import type {ComponentProps, ReactNode} from 'react';
import {NavLink, useLocation} from 'react-router-dom';
import IconButton from 'toolbar/components/navigation/IconButton';

interface Props extends ComponentProps<typeof NavLink> {
  icon: ReactNode;
  label: string;
  children?: ReactNode;
}

export default function NavButton({children, icon, label, to}: Props) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <NavLink to={isActive ? '/' : to}>
      <IconButton icon={icon} title={label}>
        {children}
      </IconButton>
    </NavLink>
  );
}
