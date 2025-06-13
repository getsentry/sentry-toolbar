import Indicator from 'toolbar/components/base/Indicator';
import Input from 'toolbar/components/base/Input';
import SegmentedControl from 'toolbar/components/base/SegmentedControl';
import type {Prefilter} from 'toolbar/components/panels/featureFlags/FeatureFlagsPanel';
import {useFeatureFlagAdapterContext} from 'toolbar/context/FeatureFlagAdapterContext';

interface Props {
  defaultPrefilter: Prefilter;
  setPrefilter: (prefilter: Prefilter) => void;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
}

export default function FeatureFlagFilters({defaultPrefilter, setPrefilter, searchTerm, setSearchTerm}: Props) {
  const {overrides} = useFeatureFlagAdapterContext();
  return (
    <div className="grid grid-cols-2 gap-1">
      <Input
        className="col-span-1"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search"
      />
      <div className="relative grid">
        <SegmentedControl<Prefilter[]>
          defaultSelected={defaultPrefilter}
          options={{
            all: {label: 'All'},
            overrides: {label: 'Overrides'},
          }}
          onChange={value => setPrefilter(value)}
        />
        {Object.keys(overrides).length ? <Indicator position="top-right" variant="red" /> : null}
      </div>
    </div>
  );
}
