import Button from 'toolbar/components/base/Button';
import IconLock from 'toolbar/components/icon/IconLock';
import {useApiProxyInstance} from 'toolbar/context/ApiProxyContext';

export default function Logout() {
  const apiProxy = useApiProxyInstance();
  return (
    <Button onClick={() => apiProxy.logout()} className="flex w-full items-center gap-1 py-0.25">
      <IconLock size="sm" isLocked={false} />
      Sign Out
    </Button>
  );
}
