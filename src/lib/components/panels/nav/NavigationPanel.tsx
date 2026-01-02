import {Transition} from '@headlessui/react';
import {cva, cx} from 'cva';
import type {MouseEvent} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import type {To} from 'react-router-dom';
import Indicator from 'toolbar/components/base/Indicator';
import IconFlag from 'toolbar/components/icon/IconFlag';
import IconIssues from 'toolbar/components/icon/IconIssues';
import IconMegaphone from 'toolbar/components/icon/IconMegaphone';
import IconSentry from 'toolbar/components/icon/IconSentry';
import NavButton from 'toolbar/components/panels/nav/NavButton';
import NavGrabber from 'toolbar/components/panels/nav/NavGrabber';
import useNavigationExpansion from 'toolbar/components/panels/nav/useNavigationExpansion';
import {useApiProxyState} from 'toolbar/context/ApiProxyContext';
import {useConfigContext} from 'toolbar/context/ConfigContext';
import {useFeatureFlagAdapterContext} from 'toolbar/context/FeatureFlagAdapterContext';
import {useMousePositionContext} from 'toolbar/context/MousePositionContext';
import parsePlacement from 'toolbar/utils/parsePlacement';

const navClassName = cva('flex items-center gap-1', {
  variants: {
    isHorizontal: {
      false: ['flex-col'],
      true: ['flex-row'],
    },
  },
});

export default function NavigationPanel() {
  const [{placement}] = useConfigContext();
  const [mousePosition] = useMousePositionContext();
  const isMoving = Boolean(mousePosition);
  const {isExpanded, setIsHovered} = useNavigationExpansion();
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
      <NavButton {...toPathOrHome('/settings')} tooltip="More options">
        <IconSentry size="sm" />
      </NavButton>

      <Transition show={isMoving || isExpanded}>
        <div
          className={cx(navClassName({isHorizontal}), 'p-0 transition duration-300 ease-in data-[closed]:opacity-0')}>
          <NavGrabber isHorizontal={isHorizontal} />

          {proxyState === 'logged-in' ? (
            <NavButton to="/issues" tooltip="Issues">
              <IconIssues size="sm" />
            </NavButton>
          ) : null}

          {proxyState === 'logged-in' ? (
            <NavButton to="/feedback" tooltip="User Feedback">
              <IconMegaphone size="sm" />
            </NavButton>
          ) : null}

          <NavButton to="/featureFlags" tooltip="Feature Flags">
            {Object.keys(overrides).length ? <Indicator position="top-right" variant="red" /> : null}
            <IconFlag size="sm" />
          </NavButton>
        </div>
      </Transition>
    </div>
  );
}
