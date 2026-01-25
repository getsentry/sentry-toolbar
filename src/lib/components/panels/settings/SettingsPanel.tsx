import {cx} from 'cva';
import {addDays, addMonths} from 'date-fns';
import {twMerge} from 'tailwind-merge';
import ExternalLink from 'toolbar/components/base/ExternalLink';
import InternalLink from 'toolbar/components/base/InternalLink';
import ScrollableList from 'toolbar/components/base/ScrollableList';
import Select from 'toolbar/components/base/Select';
import SentryAppLink from 'toolbar/components/base/SentryAppLink';
import SwitchButton from 'toolbar/components/base/SwitchButton';
import IconChevron from 'toolbar/components/icon/IconChevron';
import IconOpen from 'toolbar/components/icon/IconOpen';
import IconPin from 'toolbar/components/icon/IconPin';
import IconSettings from 'toolbar/components/icon/IconSettings';
import IconShow from 'toolbar/components/icon/IconShow';
import useNavigationExpansion from 'toolbar/components/panels/nav/useNavigationExpansion';
import CurrentOrg from 'toolbar/components/panels/settings/CurrentOrg';
import CurrentUser from 'toolbar/components/panels/settings/CurrentUser';
import ProxyState from 'toolbar/components/panels/settings/ProxyState';
import {useApiProxyState} from 'toolbar/context/ApiProxyContext';
import {useConfigContext} from 'toolbar/context/ConfigContext';
import {useHiddenAppContext} from 'toolbar/context/HiddenAppContext';
import useToast from 'toolbar/hooks/useToast';

const sectionPadding = cx('px-2 py-1');
const sectionBorder = cx('border-b border-b-translucentGray-200');
const rowClass = cx('flex items-center justify-between gap-1');

export default function SettingsPanel() {
  const proxyState = useApiProxyState();
  const [, setHideDuration] = useHiddenAppContext();
  const {isPinned, setIsPinned} = useNavigationExpansion();
  const {showToast} = useToast();

  const [{organizationSlug, projectIdOrSlug}] = useConfigContext();

  return (
    <section className="flex grow flex-col">
      <h1 className={cx(sectionBorder, sectionPadding, 'flex flex-row items-center gap-1 font-medium')}>
        {proxyState === 'logged-in' ? (
          <CurrentOrg size="md" link={false} />
        ) : (
          <div className="flex items-center gap-1">
            <IconSettings size="md" />
            {organizationSlug}
          </div>
        )}
      </h1>

      <ScrollableList>
        <li className={twMerge(cx(rowClass, sectionPadding, sectionBorder), 'flex-col items-stretch')}>
          <SentryAppLink
            className="flex items-center gap-1 text-sm "
            to={{url: `/organizations/${organizationSlug}/projects/${projectIdOrSlug}/`}}>
            <IconOpen size="sm" />
            {organizationSlug}/{projectIdOrSlug}
          </SentryAppLink>
        </li>

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
            Hide Toolbar
          </span>
          <Select
            value=""
            onChange={e => {
              const value = e.target.value;
              switch (value) {
                case 'session':
                  showToast('Toolbar hidden for this session');
                  setHideDuration('session');
                  break;
                case 'day':
                  showToast('Toolbar hidden for 1 day');
                  setHideDuration(addDays(new Date(), 1));
                  break;
                case 'month':
                  showToast('Toolbar hidden for 1 month');
                  setHideDuration(addMonths(new Date(), 1));
                  break;
              }
            }}
            aria-label="Hide Toolbar"
            title="Hide Toolbar">
            <option value="" disabled>
              Select duration
            </option>
            <option value="session">This Session</option>
            <option value="day">1 Day</option>
            <option value="month">1 Month</option>
          </Select>
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
