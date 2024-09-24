import type {ReactNode} from 'react';

interface Props {
  children?: ReactNode;
}

export default function PanelLayout({children}: Props) {
  return (
    <div className="h-[90vh] max-h-[560px] w-[320px] max-w-[320px] rounded-xl border border-gray-200 bg-white shadow-lg">
      <section className="h-full overflow-y-auto">{children}</section>
    </div>
  );
}
