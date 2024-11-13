import {type MouseEvent} from 'react';

interface Props {
  isActive: boolean;
  onClick: (event: MouseEvent) => void;
  size: 'sm' | 'big';
}

export default function SwitchButton({isActive, onClick, size}: Props) {
  return (
    <button
      className={`relative inline-block ${size === 'sm' ? 'h-2 w-4' : 'h-[24px] w-[45px]'} rounded-full border border-[#e0dce5] bg-white p-0 transition-[border,box-shadow] duration-100 focus:border-[#6c5fc7] `}
      onClick={onClick}>
      <span
        className={`absolute  ${size === 'sm' ? 'top-px size-1.5' : 'top-[3px] size-2'}
    rounded-full bg-[#e0dce5] transition`}
        style={{
          translate: isActive ? (size === 'sm' ? '0px' : '3px') : size === 'sm' ? '-12px' : '-19px',
          backgroundColor: isActive ? 'var(--purple-400)' : 'var(--gray-100)',
        }}></span>
    </button>
  );
}
