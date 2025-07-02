import type {ReactNode} from 'react';
import {useEffect, useContext, useCallback, useRef} from 'react';
import {Tooltip, TooltipContent, TooltipTrigger} from 'toolbar/components/base/tooltip/Tooltip';
import IconSentry from 'toolbar/components/icon/IconSentry';
import CenterLayout from 'toolbar/components/layouts/CenterLayout';
import UnauthPill from 'toolbar/components/unauth/UnauthPill';
import ShadowRootContext from 'toolbar/context/ShadowRootContext';
import useClicksOutside from 'toolbar/hooks/useClicksOutside';
import {useSessionStorage} from 'toolbar/hooks/useStorage';
import useTimeout from 'toolbar/hooks/useTimeout';

interface Props {
  children: ReactNode;
}

export default function UnauthLayout({children}: Props) {
  const shadowRoot = useContext(ShadowRootContext);
  const [isCollapsed, setIsCollapsed] = useSessionStorage('isUnauthCollapsed', false);

  const {start, cancel} = useTimeout({
    timeMs: 5_000,
    onTimeout: useCallback(() => setIsCollapsed(true), [setIsCollapsed]),
  });
  useEffect(start, [start]);

  const clicksRef = useRef(0);
  useClicksOutside({
    node: shadowRoot.host,
    onClickInside: useCallback(() => {
      clicksRef.current = 0;
      cancel();
      setIsCollapsed(false);
    }, [cancel, setIsCollapsed]),
    onClickOutside: useCallback(() => {
      clicksRef.current++;
      if (clicksRef.current >= 3) {
        clicksRef.current = 0;
        setIsCollapsed(true);
      }
    }, [setIsCollapsed]),
  });

  if (isCollapsed) {
    return (
      <div role="dialog" className="pointer-events-none fixed inset-0 flex h-full items-center justify-end">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="pointer-events-auto flex flex-row place-items-center gap-1 rounded-l-full border border-r-0 border-black-raw bg-black-raw p-1 pr-0.5 text-sm text-white-raw hover:bg-white-raw hover:text-black-raw"
              aria-label="Expand toolbar and login"
              onClick={() => setIsCollapsed(false)}>
              <IconSentry size="sm" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="whitespace-nowrap">Expand Sentry Toolbar and Login</TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <CenterLayout>
      <CenterLayout.MainArea>
        <UnauthPill>{children}</UnauthPill>
      </CenterLayout.MainArea>
    </CenterLayout>
  );
}
