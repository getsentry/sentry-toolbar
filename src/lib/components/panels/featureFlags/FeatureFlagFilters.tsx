import Input from 'toolbar/components/base/Input';
import SegmentedControl from 'toolbar/components/base/SegmentedControl';
import {useFeatureFlagsContext} from 'toolbar/components/panels/featureFlags/featureFlagsContext';
import type {Prefilter} from 'toolbar/components/panels/featureFlags/FeatureFlagsPanel';

interface Props {
  defaultPrefilter: Prefilter;
}

export default function FeatureFlagFilters({defaultPrefilter}: Props) {
  const {setPrefilter, setSearchTerm} = useFeatureFlagsContext();
  return (
    <div className="grid grid-cols-2 gap-1">
      <Input className="col-span-1" onChange={e => setSearchTerm(e.target.value)} placeholder="Search" />
      <SegmentedControl<Prefilter[]>
        defaultSelected={defaultPrefilter}
        options={{
          all: {label: 'All'},
          overrides: {label: 'Overrides'},
        }}
        onChange={value => setPrefilter(value)}
      />
    </div>
  );
}
