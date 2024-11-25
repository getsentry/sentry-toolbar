import {cva, cx} from 'cva';
import {motion} from 'framer-motion';
import {Fragment, useContext} from 'react';
import type {MouseEvent} from 'react';
import {NavLink, useLocation, useNavigate} from 'react-router-dom';
import type {To} from 'react-router-dom';
import IconFlag from 'toolbar/components/icon/IconFlag';
import IconIssues from 'toolbar/components/icon/IconIssues';
import IconLock from 'toolbar/components/icon/IconLock';
import IconMegaphone from 'toolbar/components/icon/IconMegaphone';
import IconPin from 'toolbar/components/icon/IconPin';
import IconSentry from 'toolbar/components/icon/IconSentry';
import IconSettings from 'toolbar/components/icon/IconSettings';
import {useApiProxyInstance} from 'toolbar/context/ApiProxyContext';
import ConfigContext from 'toolbar/context/ConfigContext';
import useNavigationExpansion from 'toolbar/hooks/useNavigationExpansion';
import {DebugTarget} from 'toolbar/types/config';

const navClassName = cx(['flex flex-col items-center gap-1 p-1']);

const navSeparator = cx(['m-0', 'w-full', 'border-translucentGray-200']);

const navItemClassName = cva(
  ['flex', 'gap-1', 'rounded-md', 'p-1', 'text-gray-400', 'border', 'border-solid', 'border-transparent'],
  {
    variants: {
      clickable: {
        true: [
          'hover:text-purple-400',
          'hover:bg-purple-100',
          'hover:border-current',
          'hover:disabled:border-transparent',
          'aria-currentPage:text-purple-400',
          'aria-currentPage:bg-purple-100',
          'aria-currentPage:border-current',
        ],
      },
    },
    defaultVariants: {
      clickable: true,
    },
  }
);

export default function Navigation() {
  const {debug} = useContext(ConfigContext);
  const {isExpanded, isPinned, setIsHovered, setIsPinned} = useNavigationExpansion();
  const {pathname} = useLocation();
  const navigate = useNavigate();
  const apiProxy = useApiProxyInstance();

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
    <motion.div
      layout="position"
      className={navClassName}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}>
      <span className={navItemClassName({clickable: false})}>
        <IconSentry size="sm" />
      </span>
      {isExpanded ? (
        <Fragment>
          <hr className={navSeparator} />

          {debug?.includes(DebugTarget.SETTINGS) ? (
            <NavLink {...toPathOrHome('/settings')} title="Settings" className={navItemClassName({})}>
              <IconSettings size="sm" />
            </NavLink>
          ) : null}
          <NavLink {...toPathOrHome('/issues')} title="Issues" className={navItemClassName()}>
            <IconIssues size="sm" />
          </NavLink>
          <NavLink {...toPathOrHome('/feedback')} title="User Feedback" className={navItemClassName()}>
            <IconMegaphone size="sm" />
          </NavLink>
          <NavLink {...toPathOrHome('/featureFlags')} title="Feature Flags" className={navItemClassName()}>
            <IconFlag size="sm" />
          </NavLink>

          <hr className={navSeparator} />

          <button
            className={navItemClassName()}
            onClick={() => {
              const signal = new AbortController().signal; // TODO: nothing is cancellable with this signal
              apiProxy.exec(signal, 'clear-authn', []);
            }}
            title="Logout"
            aria-label="Logout">
            <IconLock size="sm" isLocked={false} />
          </button>

          <hr className={navSeparator} />

          <button
            className={navItemClassName()}
            onClick={() => setIsPinned(!isPinned)}
            title={isPinned ? 'Allow collapsing' : 'Keep the toolbar open'}
            aria-label={isPinned ? 'Allow collapsing' : 'Keep the toolbar open'}>
            <IconPin size="sm" isSolid={isPinned} />
          </button>
        </Fragment>
      ) : null}
    </motion.div>
  );
}
