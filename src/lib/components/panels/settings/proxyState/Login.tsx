import {useCallback, useRef, useState} from 'react';
import Button from 'toolbar/components/base/Button';
import IconLock from 'toolbar/components/icon/IconLock';
import {useApiProxyInstance} from 'toolbar/context/ApiProxyContext';
import {useConfigContext} from 'toolbar/context/ConfigContext';
import {DebugTarget} from 'toolbar/types/Configuration';

const POPUP_MESSAGE_DELAY_MS = 3_000;

export default function Login() {
  const [{debug}] = useConfigContext();
  const debugLoginSuccess = debug.includes(DebugTarget.LOGIN_SUCCESS);

  const apiProxy = useApiProxyInstance();

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const timeoutRef = useRef<null | number>(null);
  const [showPopupBlockerMessage, setShowPopupBlockerMessage] = useState(false);

  const resetState = useCallback(() => {
    setIsLoggingIn(false);
    setShowPopupBlockerMessage(false);
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
  }, []);

  const openPopup = useCallback(() => {
    setIsLoggingIn(true);

    apiProxy.login(debugLoginSuccess ? undefined : POPUP_MESSAGE_DELAY_MS);

    // start timer, after a sec ask about popups
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setShowPopupBlockerMessage(true);
    }, POPUP_MESSAGE_DELAY_MS);
  }, [apiProxy, debugLoginSuccess]);

  return (
    <div className="flex flex-col">
      {isLoggingIn ? (
        <div className="flex items-center justify-between gap-0.25">
          <span className="py-1">Logging in...</span>
          <Button onClick={resetState} className="py-0">
            Reset
          </Button>
        </div>
      ) : (
        <Button variant="primary" onClick={openPopup} className="flex w-full items-center gap-1 py-1">
          <IconLock size="sm" isLocked />
          Login
        </Button>
      )}
      {showPopupBlockerMessage ? (
        <div className="py-1">Don&apos;t see the login popup? Check your popup blocker</div>
      ) : null}
    </div>
  );
}
