import {useContext} from 'react';
import ConfigContext from 'toolbar/context/ConfigContext';
import useFetchSentryData from 'toolbar/hooks/fetch/useFetchSentryData';
import {useOrganizationQuery} from 'toolbar/sentryApi/queryKeys';

export default function SettingsPanel() {
  const {organizationIdOrSlug} = useContext(ConfigContext);
  const {data, refetch} = useFetchSentryData({
    ...useOrganizationQuery(String(organizationIdOrSlug)),
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
