import {useCallback, useState} from 'react';
import Input from 'toolbar/components/base/Input';
import SwitchButton from 'toolbar/components/base/SwitchButton';
import IconAdd from 'toolbar/components/icon/IconAdd';

interface Props {
  onSubmit: (name: string, value: boolean) => void;
}

export default function CustomOverride({onSubmit}: Props) {
  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(false);

  const resetForm = useCallback(() => {
    setName('');
    setIsActive(false);
  }, []);

  return (
    <form
      className="relative grid grid-cols-[auto_max-content_max-content] items-center gap-1 text-sm tracking-[0.01rem]"
      onSubmit={e => {
        e.preventDefault();
        resetForm();
        onSubmit(name, isActive);
      }}>
      <Input placeholder="Flag name to override" value={name} onChange={e => setName(e.target.value.toLowerCase())} />
      <SwitchButton
        isActive={isActive}
        onClick={e => {
          e.preventDefault();
          setIsActive(!isActive);
        }}
        size="lg"
      />
      <button
        className="relative inline-block rounded-md border bg-white p-0.75 text-xs font-semibold transition-[background,border,box-shadow] disabled:cursor-not-allowed disabled:opacity-65"
        type="submit"
        disabled={!name.length}>
        <IconAdd size="xs" />
      </button>
    </form>
  );
}
