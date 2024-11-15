import {type Dispatch, type SetStateAction, useState} from 'react';
import IconChevron from 'toolbar/components/icon/IconChevron';
import IconClose from 'toolbar/components/icon/IconClose';
import CustomOverride from 'toolbar/components/panels/featureFlags/CustomOverride';
import FeatureFlagItem from 'toolbar/components/panels/featureFlags/FeatureFlagItem';
import {
  FeatureFlagsContextProvider,
  useFeatureFlagsContext,
} from 'toolbar/components/panels/featureFlags/featureFlagsContext';

type Prefilter = 'all' | 'overrides';

export default function FeatureFlagsPanel() {
  const [prefilter, setPrefilter] = useState<Prefilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddFlagActive, setIsAddFlagActive] = useState(false);

  return (
    <FeatureFlagsContextProvider>
      <section className="flex grow flex-col">
        <h1 className="flex flex-row justify-between border-b border-b-translucentGray-200 px-2 py-1">
          <span className="font-medium">Feature Flags</span>
          <button aria-label="Override Flag" title="Override Flag" onClick={() => setIsAddFlagActive(!isAddFlagActive)}>
            <span className="flex items-center gap-0.5 text-sm font-semibold text-purple-400">
              {isAddFlagActive ? <IconChevron direction="up" size="xs" /> : <IconChevron direction="down" size="xs" />}
              Override
            </span>
          </button>
        </h1>
        <div className="flex grow flex-col">
          {isAddFlagActive && (
            <div className="relative border-b border-b-translucentGray-200 bg-translucentGray-100 px-2 py-1 text-sm tracking-[0.01rem]">
              <CustomOverride setComponentActive={setIsAddFlagActive} />
            </div>
          )}
          <div>
            <IsDirtyMessage />
            <div className="px-2 py-1 text-sm">
              <Filters setPrefilter={setPrefilter} prefilter={prefilter} setSearchTerm={setSearchTerm} />
              <FlagTable searchTerm={searchTerm} prefilter={prefilter} />
            </div>
          </div>
        </div>
      </section>
    </FeatureFlagsContextProvider>
  );
}

function IsDirtyMessage() {
  const {isDirty} = useFeatureFlagsContext();

  return isDirty ? (
    <div className="border-b border-b-translucentGray-200 px-2 py-1 text-sm text-gray-300">
      <span>Reload to see changes</span>
    </div>
  ) : (
    <div />
  );
}

function Filters({
  setPrefilter,
  prefilter,
  setSearchTerm,
}: {
  prefilter: Prefilter;
  setPrefilter: Dispatch<SetStateAction<Prefilter>>;
  setSearchTerm: Dispatch<SetStateAction<string>>;
}) {
  return (
    <div className="grid grid-cols-2 gap-1 py-1">
      <input
        className="col-span-1 h-[26px] w-full resize-y rounded-md  border bg-white p-0.75 text-xs text-gray-400 transition-[border,box-shadow] duration-100 focus:border-purple-300 focus:outline-none"
        onChange={e => setSearchTerm(e.target.value.toLowerCase())}
        placeholder="Search"
      />
      <div className="relative inline-grid h-[26px] min-w-0 grid-flow-col rounded-md border border-gray-200 bg-gray-100 text-xs leading-4">
        <button
          className="rounded-[5px]"
          onClick={e => {
            e.preventDefault();
            setPrefilter('all');
          }}
          style={{
            background: prefilter === 'all' ? 'white' : 'none',
            fontWeight: prefilter === 'all' ? '500' : 'normal',
            borderRightWidth: prefilter === 'all' ? '1px' : '0px',
          }}>
          All
        </button>
        <button
          className="rounded-[5px]"
          onClick={e => {
            e.preventDefault();
            setPrefilter('overrides');
          }}
          style={{
            background: prefilter === 'overrides' ? 'white' : 'none',
            fontWeight: prefilter === 'overrides' ? '500' : 'normal',
            borderLeftWidth: prefilter === 'overrides' ? '1px' : '0px',
          }}>
          Overrides
        </button>
      </div>
    </div>
  );
}

function FlagTable({prefilter, searchTerm}: {prefilter: Prefilter; searchTerm: string}) {
  const {featureFlagMap, clearOverrides} = useFeatureFlagsContext();

  const filtered = Object.fromEntries(
    Object.entries(featureFlagMap)?.filter(([name, {value, override}]) => {
      const overrideOnly = prefilter === 'overrides';
      const isOverridden = override !== undefined && value !== override;
      const matchesSearch = name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase());
      return overrideOnly ? isOverridden && matchesSearch : matchesSearch;
    })
  );
  const names = Object.keys(filtered).sort();

  return (
    <span>
      <div>{names?.map(name => <FeatureFlagItem key={name} flag={{name, ...filtered[name]}} />)}</div>
      {!names.length && <div>No flags to display</div>}
      {prefilter === 'overrides' && Boolean(names.length) && (
        <div className="flex flex-col items-start py-1">
          <button
            className="flex h-[28px] items-center justify-center self-stretch rounded-md border border-gray-200"
            onClick={() => {
              clearOverrides();
            }}>
            <span className=" flex items-center justify-center gap-1 text-sm">
              <IconClose isCircled size="xs" /> Remove All
            </span>
          </button>
        </div>
      )}
    </span>
  );
}
