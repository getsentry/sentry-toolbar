import {cx} from 'cva';
import Breadcrumbs from 'toolbar/components/base/Breadcrumbs';
import ScrollableList from 'toolbar/components/base/ScrollableList';
import IconSettings from 'toolbar/components/icon/IconSettings';
import {useConfigContext} from 'toolbar/context/ConfigContext';

const sectionPadding = cx('px-2 py-1');
const sectionBorder = cx('border-b border-b-translucentGray-200');

export default function ConfigPanel() {
  const [config] = useConfigContext();

  return (
    <section className="flex grow flex-col">
      <h1 className={cx(sectionBorder, sectionPadding, 'flex flex-row items-center gap-1 font-medium')}>
        <IconSettings size="sm" />
        <Breadcrumbs items={[{label: 'Settings', to: '/settings'}, {label: 'Config'}]} />
      </h1>

      <ScrollableList>
        {Object.entries(config).map(([key, value]) => (
          <li key={key} className="flex flex-col gap-0.5 px-2">
            <span className="text-sm text-gray-500">{key}</span>
            <span className="break-all ps-1 text-xs">
              {typeof value === 'function'
                ? '[Function]' + String(value)
                : typeof value === 'object' && value !== null
                  ? JSON.stringify(value)
                  : String(value)}
            </span>
          </li>
        ))}
      </ScrollableList>
    </section>
  );
}
