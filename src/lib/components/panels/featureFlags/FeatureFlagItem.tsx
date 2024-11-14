import {useContext, useState} from 'react';
import {useFeatureFlagsContext} from 'toolbar/components/panels/featureFlags/featureFlagsContext';
import SwitchButton from 'toolbar/components/SwitchButton';
import ConfigContext from 'toolbar/context/ConfigContext';
import type {FeatureFlag} from 'toolbar/types/config';

export default function FeatureFlagItem({flag}: {flag: FeatureFlag}) {
  const {featureFlags} = useContext(ConfigContext);

  return (
    <div className="flex flex-row justify-between gap-0.25 border-b border-b-translucentGray-200 py-1.5">
      <div className="flex items-start">
        {featureFlags?.urlTemplate?.(flag.name) ? (
          <a href={featureFlags.urlTemplate(flag.name)} className="text-blue-400">
            {flag.name}
          </a>
        ) : (
          <span>{flag.name}</span>
        )}
      </div>
      <div className="">
        <FlagValueInput flag={flag} />
      </div>
    </div>
  );
}

function FlagValueInput({flag}: {flag: FeatureFlag}) {
  if (typeof flag.value === 'boolean' || flag.override === true || flag.override === false) {
    return <FlagValueBooleanInput flag={flag} />;
  }

  return <code>{flag.override !== undefined ? String(flag.override) : String(flag.value)}</code>;
}

function FlagValueBooleanInput({flag}: {flag: FeatureFlag}) {
  const {setOverride} = useFeatureFlagsContext();

  const [isActive, setIsActive] = useState(flag.override !== undefined ? Boolean(flag.override) : Boolean(flag.value));

  return (
    <label htmlFor={`toggle-${flag.name}`} className="flex items-center gap-1 text-xs">
      <code>{String(isActive)}</code>
      <SwitchButton
        size="sm"
        isActive={isActive}
        onClick={() => {
          setOverride(flag.name, !isActive);
          setIsActive(!isActive);
        }}></SwitchButton>
    </label>
  );
}
