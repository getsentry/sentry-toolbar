import {cx} from 'cva';
import {useContext, useMemo, useState} from 'react';
import ExternalLink from 'toolbar/components/base/ExternalLink';
import IconChevron from 'toolbar/components/icon/IconChevron';
import IconClose from 'toolbar/components/icon/IconClose';
import IconSettings from 'toolbar/components/icon/IconSettings';
import InfiniteListItems from 'toolbar/components/InfiniteListItems';
import CustomOverride from 'toolbar/components/panels/featureFlags/CustomOverride';
import FeatureFlagFilters from 'toolbar/components/panels/featureFlags/FeatureFlagFilters';
import FeatureFlagItem from 'toolbar/components/panels/featureFlags/FeatureFlagItem';
import ConfigContext from 'toolbar/context/ConfigContext';
import {useFeatureFlagAdapterContext} from 'toolbar/context/FeatureFlagAdapterContext';
import type {ApiResult} from 'toolbar/types/api';

export type Prefilter = 'all' | 'overrides';

const sectionPadding = cx('px-2 py-1');
const sectionBorder = cx('border-b border-b-translucentGray-200');

export default function FeatureFlagsPanel() {
  const {featureFlags} = useContext(ConfigContext);

  return featureFlags ? <FeatureFlagEditor /> : <FeatureFlagConfigHelp />;
}

function FeatureFlagConfigHelp() {
  return (
    <section className="flex grow flex-col">
      <h1 className={cx(sectionBorder, sectionPadding, 'flex flex-row justify-between font-medium')}>
        <span>Feature Flags</span>
      </h1>
      <div className={cx(sectionPadding, 'flex grow flex-col items-center justify-center gap-1')}>
        <IconSettings size="xxl" />
        <h3 className="text-sm text-gray-400">Feature flags aren&apos;t set up.</h3>
        <p className="px-1 text-center text-xs text-gray-300">
          To view your feature flags in the Sentry Dev Toolbar,{' '}
          <ExternalLink to={{url: 'https://docs.sentry.io/product/dev-toolbar/setup/#implement-feature-flag-adapter'}}>
            please read our docs
          </ExternalLink>
          .
        </p>
      </div>
    </section>
  );
}

function FeatureFlagEditor() {
  const {flagMap, overrides, clearOverrides, isDirty, setOverride} = useFeatureFlagAdapterContext();
  const [prefilter, setPrefilter] = useState<Prefilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddFlag, setShowAddFlag] = useState(false);

  const overrideOnly = prefilter === 'overrides';
  const visibleFlagNames = useMemo(
    () =>
      overrideOnly ? Object.keys(overrides) : Array.from(new Set([...Object.keys(overrides), ...Object.keys(flagMap)])),
    [flagMap, overrides, overrideOnly]
  );

  const estimateSize = 46;

  return (
    <section className="flex grow flex-col">
      <h1 className={cx(sectionBorder, sectionPadding, 'flex flex-row justify-between font-medium')}>
        <span>Feature Flags</span>
        <button
          className="flex cursor-pointer items-center gap-0.5 text-sm text-purple-400 hover:underline"
          aria-label="Override Flag"
          title="Override Flag"
          onClick={() => setShowAddFlag(!showAddFlag)}>
          <IconChevron direction={showAddFlag ? 'down' : 'right'} size="xs" />
          <span>Override</span>
        </button>
      </h1>

      {showAddFlag ? (
        <div className={cx(sectionBorder, sectionPadding, 'bg-translucentGray-100')}>
          <CustomOverride
            onSubmit={(name: string, value: boolean) => {
              setShowAddFlag(false);
              setOverride(name, value);
            }}
          />
        </div>
      ) : null}

      {isDirty ? (
        <a
          href="#"
          onClick={() => {
            window.location.reload();
          }}
          className={cx(sectionBorder, 'px-2 py-0.75', 'text-sm text-gray-300 hover:underline')}>
          Reload to see changes
        </a>
      ) : null}

      <div className={cx(sectionBorder, 'test-sm')}>
        <div className={cx(sectionPadding, 'flex flex-row')}>
          <FeatureFlagFilters
            defaultPrefilter={prefilter}
            setPrefilter={setPrefilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        {prefilter === 'overrides' ? (
          <div className={cx(sectionPadding, 'flex flex-col items-stretch')}>
            <button
              className="flex items-center justify-center gap-1 self-stretch rounded-md border border-gray-200 p-0.75 text-sm hover:bg-gray-100 hover:underline"
              onClick={clearOverrides}>
              <IconClose isCircled size="xs" />
              <span>Reset All Overrides</span>
            </button>
          </div>
        ) : null}
      </div>

      <div className="flex grow flex-col">
        <InfiniteListItems<string>
          estimateSize={() => estimateSize}
          queryResult={{
            data: {
              pages: [
                {
                  ok: true,
                  status: 200,
                  statusText: 'OK',
                  url: '',
                  headers: {},
                  text: '',
                  json: visibleFlagNames,
                } satisfies ApiResult<string[]>,
              ],
              pageParams: [[]],
            },
            hasNextPage: false,
            isFetchingNextPage: false,
            fetchNextPage: () => Promise.reject(),
          }}
          itemRenderer={(props: {item: string}) => <FeatureFlagItem {...props} name={props.item} />}
          emptyMessage={() => <p className="px-2 py-1 text-sm text-gray-400">No flags to display</p>}
        />
      </div>
    </section>
  );
}
