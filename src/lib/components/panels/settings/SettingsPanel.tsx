import {useContext, useMemo} from 'react';
import PanelLayout from 'toolbar/components/panels/PanelLayout';
import {ConfigContext} from 'toolbar/context/ConfigContext';
import useFetchSentryData from 'toolbar/hooks/fetch/useFetchSentryData';

export default function SettingsPanel() {
  const {organizationIdOrSlug} = useContext(ConfigContext);
  const {data, refetch} = useFetchSentryData({
    queryKey: useMemo(() => [`/organizations/${organizationIdOrSlug}/`], [organizationIdOrSlug]),
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
