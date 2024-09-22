import {useContext} from 'react';
import PanelLayout from 'toolbar/components/panels/PanelLayout';
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
    <PanelLayout>
      <button onClick={() => refetch()}>Reload Data</button>
      <div>
        <code>
          <pre>{JSON.stringify(data, null, '\t')}</pre>
        </code>
      </div>
    </PanelLayout>
  );
}
