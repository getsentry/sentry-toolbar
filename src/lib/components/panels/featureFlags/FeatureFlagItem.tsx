import {useState} from 'react';
import ExternalLink from 'toolbar/components/base/ExternalLink';
import SwitchButton from 'toolbar/components/base/SwitchButton';
import {useFeatureFlagsContext} from 'toolbar/components/panels/featureFlags/featureFlagsContext';
import type {FlagValue} from 'toolbar/init/featureFlagAdapter';

interface Props {
  name: string;
}

export default function FeatureFlagItem({name}: Props) {
  const {flags, overrides, urlTemplate} = useFeatureFlagsContext();

  const url = String(urlTemplate?.(name) ?? '');
  return (
    <div className="px-2">
      <div className="flex flex-row justify-between gap-1 border-b border-b-translucentGray-200 py-1.5">
        <div className="flex items-start">
          {url ? <ExternalLink to={{url}}>{name}</ExternalLink> : <span>{name}</span>}
        </div>
        <div>
          <FlagValueInput name={name} value={flags[name]} override={overrides[name]} />
        </div>
      </div>
    </div>
  );
}

function FlagValueInput({name, value, override}: {name: string; value: FlagValue; override: FlagValue}) {
  if (typeof value === 'boolean' || override === true || override === false) {
    const isActive = override !== undefined ? Boolean(override) : Boolean(value);
    return <FlagValueBooleanInput name={name} value={isActive} />;
  }

  return <code>{override !== undefined ? String(override) : String(value)}</code>;
}

function FlagValueBooleanInput({name, value}: {name: string; value: boolean}) {
  const {setOverride} = useFeatureFlagsContext();

  const [isActive, setIsActive] = useState(value);
  const id = `toggle-${name}`;
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-1 text-xs">
      <code>{String(isActive)}</code>
      <SwitchButton
        id={id}
        size="sm"
        isActive={isActive}
        onClick={() => {
          setOverride(name, !isActive);
          setIsActive(!isActive);
        }}
      />
    </label>
  );
}
