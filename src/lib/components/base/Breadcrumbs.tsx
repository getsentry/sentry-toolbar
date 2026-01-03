import {Fragment, type ReactNode} from 'react';
import InternalLink from 'toolbar/components/base/InternalLink';
import IconSlashForward from 'toolbar/components/icon/IconSlashForward';

interface TextItem {
  label: ReactNode;
}

interface LinkItem {
  label: ReactNode;
  to: string;
}

export type BreadcrumbItem = TextItem | LinkItem;

interface Props {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({items}: Props) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-0.5">
      {items.map((item, index) => (
        <Fragment key={index}>
          {index > 0 && (
            <IconSlashForward direction="right" size="xs" className="shrink-0 text-gray-400" aria-hidden="true" />
          )}
          {'to' in item && item.to ? <InternalLink to={item.to}>{item.label}</InternalLink> : <span>{item.label}</span>}
        </Fragment>
      ))}
    </nav>
  );
}
