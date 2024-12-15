import {useContext} from 'react';
import ConfigContext from 'toolbar/context/ConfigContext';

export default function SettingsPanel() {
  const config = useContext(ConfigContext);

  return (
    <section className="h-full overflow-y-auto">
      <div>
        <code>
          <pre>{JSON.stringify(config, null, '\t')}</pre>
        </code>
      </div>
    </section>
  );
}
