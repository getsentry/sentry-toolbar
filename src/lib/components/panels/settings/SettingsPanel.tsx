import {cx} from 'cva';
import {twMerge} from 'tailwind-merge';
import Button from 'toolbar/components/base/Button';
import ExternalLink from 'toolbar/components/base/ExternalLink';
import InternalLink from 'toolbar/components/base/InternalLink';
import ScrollableList from 'toolbar/components/base/ScrollableList';
import SwitchButton from 'toolbar/components/base/SwitchButton';
import IconChevron from 'toolbar/components/icon/IconChevron';
import IconOpen from 'toolbar/components/icon/IconOpen';
import IconPin from 'toolbar/components/icon/IconPin';
import IconSettings from 'toolbar/components/icon/IconSettings';
import IconShow from 'toolbar/components/icon/IconShow';
import useNavigationExpansion from 'toolbar/components/panels/nav/useNavigationExpansion';
import CurrentUser from 'toolbar/components/panels/settings/CurrentUser';
import ProxyState from 'toolbar/components/panels/settings/ProxyState';
import {useApiProxyState} from 'toolbar/context/ApiProxyContext';
import {useHiddenAppContext} from 'toolbar/context/HiddenAppContext';

const sectionPadding = cx('px-2 py-1');
const sectionBorder = cx('border-b border-b-translucentGray-200');
const rowClass = cx('flex items-center justify-between gap-1');

export default function SettingsPanel() {
  const proxyState = useApiProxyState();
  const [, setIsHidden] = useHiddenAppContext();
  const {isPinned, setIsPinned} = useNavigationExpansion();

  return (
    <section className="flex grow flex-col">
      <h1 className={cx(sectionBorder, sectionPadding, 'flex flex-row items-center gap-1 font-medium')}>
        <IconSettings size="sm" />
        <span>Settings</span>
      </h1>

      <ScrollableList>
        <li className={twMerge(cx(rowClass, sectionPadding, sectionBorder), 'flex-col items-stretch')}>
          {proxyState === 'logged-in' ? <CurrentUser /> : null}
          <ProxyState />
        </li>

        <li className={cx(rowClass, sectionPadding)}>
          <label htmlFor="toggle-pinned" className="flex w-full items-center justify-between">
            <span className="flex items-center gap-1 text-sm">
              <IconPin isSolid={isPinned} size="sm" />
              {isPinned ? 'Un-Pin Toolbar' : 'Pin Toolbar'}
            </span>
            <SwitchButton id="toggle-pinned" size="sm" isActive={isPinned} onClick={() => setIsPinned(!isPinned)} />
          </label>
        </li>

        <li className={cx(rowClass, sectionPadding, sectionBorder)}>
          <span className="flex items-center gap-1 text-sm">
            <IconShow size="sm" />
            Hide for Session
          </span>
          <Button onClick={() => setIsHidden(true)} aria-label="Hide for Session" title="Hide for Session">
            Hide
          </Button>
        </li>

        <li className={cx(rowClass, sectionPadding)}>
          <InternalLink to="/settings/config" className="flex w-full items-center justify-between gap-1 text-sm">
            Show Toolbar Config
            <IconChevron direction="right" size="sm" />
          </InternalLink>
        </li>

        <li className={cx(rowClass, sectionPadding, sectionBorder)}>
          <ExternalLink
            to={{url: 'https://docs.sentry.io/product/sentry-toolbar/'}}
            className="flex items-center gap-1 text-sm ">
            <IconOpen size="sm" />
            Read the Docs
          </ExternalLink>
        </li>
      </ScrollableList>
    </section>
  );
}
