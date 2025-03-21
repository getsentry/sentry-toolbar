import {cx} from 'cva';
import {useCallback, useContext, useRef, useState} from 'react';
import UnauthPill from 'toolbar/components/unauth/UnauthPill';
import {useApiProxyInstance} from 'toolbar/context/ApiProxyContext';
import ConfigContext from 'toolbar/context/ConfigContext';
import {DebugTarget} from 'toolbar/types/Configuration';

const POPUP_MESSAGE_DELAY_MS = 3_000;

const buttonClass = cx('rounded-full text-white-raw p-1 hover:bg-gray-500 hover:underline');

export default function Login() {
  const {debug} = useContext(ConfigContext);
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

    apiProxy.login(debugLoginSuccess ? undefined : 3000);

    // start timer, after a sec ask about popups
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setShowPopupBlockerMessage(true);
    }, POPUP_MESSAGE_DELAY_MS);
  }, [apiProxy, debugLoginSuccess]);

  return (
    <UnauthPill>
      <div className="flex-col">
        {isLoggingIn ? (
          <div className="flex gap-0.25">
            <span className="py-1">Logging in...</span>
            <button className={buttonClass} onClick={resetState}>
              reset
            </button>
          </div>
        ) : (
          <button className={buttonClass} onClick={openPopup}>
            Login to Sentry
          </button>
        )}
        {showPopupBlockerMessage ? (
          <div className="py-1">Don&apos;t see the login popup? Check your popup blocker</div>
        ) : null}
      </div>
    </UnauthPill>
  );
}
