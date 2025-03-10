import {cx} from 'cva';
import {useContext, useState} from 'react';
import ExternalLink from 'toolbar/components/base/ExternalLink';
import IconChevron from 'toolbar/components/icon/IconChevron';
import IconSettings from 'toolbar/components/icon/IconSettings';
import CustomOverride from 'toolbar/components/panels/featureFlags/CustomOverride';
import FeatureFlagFilters from 'toolbar/components/panels/featureFlags/FeatureFlagFilters';
import {
  FeatureFlagsContextProvider,
  useFeatureFlagsContext,
} from 'toolbar/components/panels/featureFlags/featureFlagsContext';
import FeatureFlagTable from 'toolbar/components/panels/featureFlags/FeatureFlagTable';
import ConfigContext from 'toolbar/context/ConfigContext';

export type Prefilter = 'all' | 'overrides';

const sectionPadding = cx('px-2 py-1');
const sectionBorder = cx('border-b border-b-translucentGray-200');

export default function FeatureFlagsPanel() {
  const {featureFlags} = useContext(ConfigContext);

  if (featureFlags) {
    return (
      <FeatureFlagsContextProvider featureFlags={featureFlags}>
        <FeatureFlagEditor />
      </FeatureFlagsContextProvider>
    );
  } else {
    return <FeatureFlagConfigHelp />;
  }
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
  const {isDirty, setOverride} = useFeatureFlagsContext();

  const [showAddFlag, setShowAddFlag] = useState(false);

  return (
    <section className="flex max-w-[inherit] grow flex-col">
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
        <div className={cx(sectionBorder)}>
          <div className={cx(sectionPadding, 'bg-translucentGray-100')}>
            <CustomOverride
              onSubmit={(name: string, value: boolean) => {
                setShowAddFlag(false);
                setOverride(name, value);
              }}
            />
          </div>
        </div>
      ) : null}

      {isDirty ? (
        <div className={cx(sectionBorder, sectionPadding, 'text-sm text-gray-300')}>
          <a
            href="#"
            onClick={e => {
              e.preventDefault();
              window.location.reload();
            }}>
            Reload to see changes
          </a>
        </div>
      ) : null}

      <div className={cx(sectionPadding, 'flex flex-col gap-1 text-sm')}>
        <FeatureFlagFilters defaultPrefilter={'all'} />
        <FeatureFlagTable />
      </div>
    </section>
  );
}
