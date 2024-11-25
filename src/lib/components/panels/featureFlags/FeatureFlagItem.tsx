import {useState} from 'react';
import ExternalLink from 'toolbar/components/base/ExternalLink';
import SwitchButton from 'toolbar/components/base/SwitchButton';
import {useFeatureFlagsContext} from 'toolbar/components/panels/featureFlags/featureFlagsContext';
import type {FeatureFlagAdapter, FlagOverrides} from 'toolbar/types/featureFlags';

interface Props {
  name: string;
  flag: FlagOverrides[string];
  url: ReturnType<NonNullable<FeatureFlagAdapter['urlTemplate']>>;
}

export default function FeatureFlagItem({name, flag, url}: Props) {
  return (
    <div className="flex flex-row justify-between gap-0.25 border-b border-b-translucentGray-200 py-1.5">
      <div className="flex items-start">
        {url ? <ExternalLink to={{url}}>{name}</ExternalLink> : <span>{name}</span>}
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
  const id = `toggle-${name}`;
  return (
    <label htmlFor={id} className="flex items-center gap-1 text-xs">
      <code>{String(isActive)}</code>
      <SwitchButton
        id={id}
        size="sm"
        isActive={isActive}
        onClick={() => {
          setOverride(name, !isActive);
          setIsActive(!isActive);
        }}></SwitchButton>
    </label>
  );
}
