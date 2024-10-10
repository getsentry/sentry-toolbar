import {useContext} from 'react';
import ConfigContext from 'toolbar/context/ConfigContext';
import useFetchSentryData from 'toolbar/hooks/fetch/useFetchSentryData';
import {useOrganizationQuery} from 'toolbar/sentryApi/queryKeys';

export default function SettingsPanel() {
  const {organizationSlug} = useContext(ConfigContext);
  const {data, refetch} = useFetchSentryData({
    ...useOrganizationQuery(String(organizationSlug)),
    retry: false,
  });

  return (
    <section className="h-full overflow-y-auto">
      <button onClick={() => refetch()}>Reload Data</button>
      <div>
        <code>
          <pre>{JSON.stringify(data, null, '\t')}</pre>
        </code>
      </div>
    </section>
  );
}
