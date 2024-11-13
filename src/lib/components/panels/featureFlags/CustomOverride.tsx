import {useState} from 'react';
import IconAdd from 'toolbar/components/icon/IconAdd';
import {useFeatureFlagsContext} from 'toolbar/components/panels/featureFlags/featureFlagsContext';
import SwitchButton from 'toolbar/components/SwitchButton';

export default function CustomOverride({setComponentActive}: {setComponentActive: (value: boolean) => void}) {
  const {setOverride} = useFeatureFlagsContext();

  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(false);

  return (
    <form
      className="grid grid-cols-[auto_max-content_max-content] items-center gap-1"
      onSubmit={e => {
        e.preventDefault();
        setOverride(name, isActive);
        setComponentActive(false);
        setName('');
        setIsActive(false);
      }}>
      <input
        className="h-[26px] w-full resize-y rounded-md border border-[#e0dce5] bg-white p-0.75 pl-1 text-xs transition-[border,box-shadow] duration-100 focus:border-[#6c5fc7] focus:outline-none focus:ring-0"
        placeholder="Flag name to override"
        value={name}
        onChange={e => setName(e.target.value.toLowerCase())}
      />
      <SwitchButton
        size="big"
        isActive={isActive}
        onClick={e => {
          e.preventDefault();
          setIsActive(!isActive);
        }}
      />
      <button
        className="relative inline-block h-[26px] w-[28px] rounded-md border border-[#e0dce5] bg-white p-0.75 pl-[7px] text-xs font-semibold opacity-65 transition-[background,border,box-shadow] disabled:cursor-not-allowed disabled:text-[#80708f]"
        type="submit"
        disabled={!name.length}>
        <IconAdd size="xs" />
      </button>
    </form>
  );
}
