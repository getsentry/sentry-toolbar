import {cx} from 'cva';
import type {MouseEvent, ReactNode} from 'react';
import {NavLink, useLocation, useNavigate} from 'react-router-dom';
import type {To} from 'react-router-dom';
import {Tooltip, TooltipTrigger, TooltipContent} from 'toolbar/components/base/tooltip/Tooltip';

interface Props {
  to: To;
  tooltip: string;
  children: ReactNode;
}

const navItemClassName = cx([
  'relative',
  'flex',
  'flex-col',
  'rounded-md',
  'p-1',
  'text-gray-400',
  'border',
  'border-solid',
  'border-transparent',
  'outline-none',
  'hover:text-purple-400',
  'hover:bg-purple-100',
  'hover:border-current',
  'hover:disabled:border-transparent',
  'aria-currentPage:text-purple-400',
  'aria-currentPage:bg-purple-100',
  'aria-currentPage:border-current',
]);

export default function NavButton({to, tooltip, children}: Props) {
  const {pathname} = useLocation();
  const navigate = useNavigate();

  const toPathOrHome = (to: To) => ({
    to,
    onClick: (e: MouseEvent) => {
      if (pathname === to) {
        e.preventDefault();
        navigate('/');
      }
    },
  });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <NavLink {...toPathOrHome(to)} className={navItemClassName}>
          {children}
        </NavLink>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
