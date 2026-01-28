import {Transition} from '@headlessui/react';
import {cva, cx} from 'cva';
import Indicator from 'toolbar/components/base/Indicator';
import IconFlag from 'toolbar/components/icon/IconFlag';
import IconIssues from 'toolbar/components/icon/IconIssues';
import IconMegaphone from 'toolbar/components/icon/IconMegaphone';
import IconSeer from 'toolbar/components/icon/IconSeer';
import IconSentry from 'toolbar/components/icon/IconSentry';
import NavButton from 'toolbar/components/panels/nav/NavButton';
import NavGrabber from 'toolbar/components/panels/nav/NavGrabber';
import useNavigationExpansion from 'toolbar/components/panels/nav/useNavigationExpansion';
import {useApiProxyState} from 'toolbar/context/ApiProxyContext';
import {useConfigContext} from 'toolbar/context/ConfigContext';
import {useFeatureFlagAdapterContext} from 'toolbar/context/FeatureFlagAdapterContext';
import {useMousePositionContext} from 'toolbar/context/MousePositionContext';
import useSeerExplorerAccess from 'toolbar/hooks/useSeerExplorerAccess';
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
  const {isExpanded, setIsHovered} = useNavigationExpansion();

  const proxyState = useApiProxyState();
  const {overrides} = useFeatureFlagAdapterContext();
  const {hasAccess: showSeerExplorer} = useSeerExplorerAccess();

  const [major] = parsePlacement(placement);
  const isHorizontal = ['top', 'bottom'].includes(major);
  const isLoggedIn = proxyState === 'logged-in';

  return (
    <div
      className={cx(navClassName({isHorizontal}), 'p-1')}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}>
      <NavButton to="/settings" tooltip="More options">
        <IconSentry size="sm" />
      </NavButton>

      <Transition show={Boolean(mousePosition) || isExpanded}>
        <div
          className={cx(navClassName({isHorizontal}), 'p-0 transition duration-300 ease-in data-[closed]:opacity-0')}>
          <NavGrabber isHorizontal={isHorizontal} />

          {isLoggedIn && (
            <>
              {showSeerExplorer && (
                <NavButton to="/seerExplorer" tooltip="Seer Explorer">
                  <IconSeer size="sm" />
                </NavButton>
              )}

              <NavButton to="/issues" tooltip="Issues">
                <IconIssues size="sm" />
              </NavButton>

              <NavButton to="/feedback" tooltip="User Feedback">
                <IconMegaphone size="sm" />
              </NavButton>
            </>
          )}

          <NavButton to="/featureFlags" tooltip="Feature Flags">
            {Object.keys(overrides).length > 0 && <Indicator position="top-right" variant="red" />}
            <IconFlag size="sm" />
          </NavButton>
        </div>
      </Transition>
    </div>
  );
}
