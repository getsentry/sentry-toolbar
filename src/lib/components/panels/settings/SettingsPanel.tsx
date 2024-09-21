import PanelLayout from 'toolbar/components/panels/PanelLayout';
import useSentryOrg from 'toolbar/hooks/useSentryOrg';

export default function SettingsPanel() {
  const {data, refetch} = useSentryOrg();

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
