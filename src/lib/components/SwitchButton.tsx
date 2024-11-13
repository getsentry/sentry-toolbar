import {type MouseEvent} from 'react';

interface Props {
  isActive: boolean;
  onClick: (event: MouseEvent) => void;
  size: 'sm' | 'big';
}

export default function SwitchButton({isActive, onClick, size}: Props) {
  return (
    <button
      className={`relative inline-block ${size === 'sm' ? 'h-2 w-4' : 'h-[24px] w-[45px]'} rounded-full
    border border-[#e0dce5] bg-white
    p-0
    shadow-[inset_0px_1px_2px_rgba(43,34,51,0.04)]
    transition-[border,box-shadow] duration-100
    focus:border-[#6c5fc7] focus:shadow-[0px_0px_0px_1px_rgba(108,95,199)]`}
      onClick={onClick}>
      <span
        className={`absolute top-[3px] ${size === 'sm' ? 'size-1.5' : 'size-2'}
    rounded-full bg-[#e0dce5] transition`}
        style={{
          translate: isActive ? '3px' : '-18px',
          backgroundColor: isActive ? 'var(--purple-400)' : 'var(--gray-100)',
        }}></span>
    </button>
  );
}
