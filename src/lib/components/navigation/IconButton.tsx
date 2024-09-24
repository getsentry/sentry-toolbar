import type {ReactNode} from 'react';

interface IconButtonProps {
  icon: ReactNode;
  title: string;
  children?: ReactNode;
  onClick?: () => void;
}

export default function IconButton({children, icon, onClick, title, ...props}: IconButtonProps) {
  return (
    <button
      aria-label={title}
      className="
      text-white
      hover:border-white
      data-[active-route=true]:bg-white
      flex
      gap-2
      rounded-sm
      border-2
      border-solid
      border-transparent
      bg-none
      p-4
      hover:disabled:border-transparent
      data-[active-route=true]:text-gray-400
      "
      onClick={onClick}
      title={title}
      {...props}>
      {icon}
      {children}
    </button>
  );
}
