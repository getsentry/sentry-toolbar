import {Fragment} from 'react';
import IconClose from 'toolbar/components/icon/IconClose';
import FeatureFlagItem from 'toolbar/components/panels/featureFlags/FeatureFlagItem';
import {useFeatureFlagsContext} from 'toolbar/components/panels/featureFlags/featureFlagsContext';

export default function FeatureFlagTable() {
  const {clearOverrides, prefilter, urlTemplate, visibleRows} = useFeatureFlagsContext();

  if (!visibleRows.length) {
    return <div>No flags to display</div>;
  }

  return (
    <Fragment>
      <div>
        {visibleRows.map(([name, flag]) => (
          <FeatureFlagItem key={name} name={name} flag={flag} url={urlTemplate?.(name)} />
        ))}
      </div>

      {prefilter === 'overrides' ? (
        <div className="flex flex-col items-start">
          <button
            className="flex items-center justify-center gap-1 self-stretch rounded-md border border-gray-200 p-0.75 text-sm"
            onClick={clearOverrides}>
            <IconClose isCircled size="xs" />
            <span>Reset All Overrides</span>
          </button>
        </div>
      ) : null}
    </Fragment>
  );
}
