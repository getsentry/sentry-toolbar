import {Transition} from '@headlessui/react';
import {cva, cx} from 'cva';
import type {MouseEvent} from 'react';
import {NavLink, useLocation, useNavigate} from 'react-router-dom';
import type {To} from 'react-router-dom';
import Indicator from 'toolbar/components/base/Indicator';
import {Tooltip, TooltipTrigger, TooltipContent} from 'toolbar/components/base/tooltip/Tooltip';
import IconFlag from 'toolbar/components/icon/IconFlag';
import IconIssues from 'toolbar/components/icon/IconIssues';
import IconMegaphone from 'toolbar/components/icon/IconMegaphone';
import OptionsMenu from 'toolbar/components/navigation/OptionsMenu';
import {navItemClassName} from 'toolbar/components/navigation/styles';
import {useApiProxyState} from 'toolbar/context/ApiProxyContext';
import {useConfigContext} from 'toolbar/context/ConfigContext';
import {useFeatureFlagAdapterContext} from 'toolbar/context/FeatureFlagAdapterContext';
import {useMousePositionContext} from 'toolbar/context/MousePositionContext';
import useNavigationExpansion from 'toolbar/hooks/useNavigationExpansion';
import parsePlacement from 'toolbar/utils/parsePlacement';

const navClassName = cva('flex items-center gap-1', {
  variants: {
    isHorizontal: {
      false: ['flex-col'],
      true: ['flex-row'],
    },
  },
});

const navGrabber = cva(
  'relative cursor-grab border-transparent after:absolute after:bg-translucentGray-200 after:hover:bg-gray-300',
  {
    variants: {
      isHorizontal: {
        false: ['-my-1 w-full py-1 after:top-1/2 after:h-px after:w-full'],
        true: ['-mx-1 h-[34px] w-px px-1 after:left-1/2 after:h-full after:w-px'],
      },
    },
  }
);

export default function Navigation() {
  const [{placement}] = useConfigContext();
  const [mousePosition] = useMousePositionContext();
  const isMoving = Boolean(mousePosition);
  const {isExpanded, isPinned, setIsHovered, setIsPinned} = useNavigationExpansion();
  const {pathname} = useLocation();
  const navigate = useNavigate();
  const proxyState = useApiProxyState();

  const {overrides} = useFeatureFlagAdapterContext();

  const toPathOrHome = (to: To) => ({
    to,
    onClick: (e: MouseEvent) => {
      if (pathname === to) {
        e.preventDefault();
        navigate('/');
      }
    },
  });

  const [major] = parsePlacement(placement);
  const isHorizontal = ['top', 'bottom'].includes(major);

  return (
    <div
      className={cx(navClassName({isHorizontal}), 'p-1')}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}>
      <OptionsMenu isPinned={isPinned} setIsPinned={setIsPinned} />

      <Transition show={isMoving || isExpanded}>
        <div
          className={cx(navClassName({isHorizontal}), 'p-0 transition duration-300 ease-in data-[closed]:opacity-0')}>
          <hr className={navGrabber({isHorizontal})} data-grabber />

          {proxyState === 'logged-in' ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink {...toPathOrHome('/issues')} className={navItemClassName}>
                  <IconIssues size="sm" />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent>Issues</TooltipContent>
            </Tooltip>
          ) : null}

          {proxyState === 'logged-in' ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink {...toPathOrHome('/feedback')} className={navItemClassName}>
                  <IconMegaphone size="sm" />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent>User Feedback</TooltipContent>
            </Tooltip>
          ) : null}

          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink {...toPathOrHome('/featureFlags')} className={navItemClassName}>
                {Object.keys(overrides).length ? <Indicator position="top-right" variant="red" /> : null}
                <IconFlag size="sm" />
              </NavLink>
            </TooltipTrigger>
            <TooltipContent>Feature Flags</TooltipContent>
          </Tooltip>
        </div>
      </Transition>
    </div>
  );
}
