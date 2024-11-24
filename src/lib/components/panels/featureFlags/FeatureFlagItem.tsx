import {useContext, useState} from 'react';
import SwitchButton from 'toolbar/components/base/SwitchButton';
import {useFeatureFlagsContext} from 'toolbar/components/panels/featureFlags/featureFlagsContext';
import ConfigContext from 'toolbar/context/ConfigContext';
import type {FlagOverrides} from 'toolbar/types/featureFlags';

export default function FeatureFlagItem({name, flag}: {name: string; flag: FlagOverrides[string]}) {
  const {featureFlags} = useContext(ConfigContext);

  return (
    <div className="flex flex-row justify-between gap-0.25 border-b border-b-translucentGray-200 py-1.5">
      <div className="flex items-start">
        {featureFlags?.urlTemplate?.(name) ? (
          <a href={featureFlags.urlTemplate(name)} className="text-blue-400">
            {name}
          </a>
        ) : (
          <span>{name}</span>
        )}
      </div>
      <div className="">
        <FlagValueInput name={name} flag={flag} />
      </div>
    </div>
  );
}

function FlagValueInput({name, flag}: {name: string; flag: FlagOverrides[string]}) {
  if (typeof flag.value === 'boolean' || flag.override === true || flag.override === false) {
    return <FlagValueBooleanInput name={name} flag={flag} />;
  }

  return <code>{flag.override !== undefined ? String(flag.override) : String(flag.value)}</code>;
}

function FlagValueBooleanInput({name, flag}: {name: string; flag: FlagOverrides[string]}) {
  const {setOverride} = useFeatureFlagsContext();

  const [isActive, setIsActive] = useState(flag.override !== undefined ? Boolean(flag.override) : Boolean(flag.value));

  return (
    <label htmlFor={`toggle-${name}`} className="flex items-center gap-1 text-xs">
      <code>{String(isActive)}</code>
      <SwitchButton
        size="sm"
        isActive={isActive}
        onClick={() => {
          setOverride(name, !isActive);
          setIsActive(!isActive);
        }}></SwitchButton>
    </label>
  );
}
