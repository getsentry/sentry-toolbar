import SentryAppLink from 'toolbar/components/SentryAppLink';
import {useConfigContext} from 'toolbar/context/ConfigContext';

export default function InvalidDomain() {
  const [{projectIdOrSlug}] = useConfigContext();

  return (
    <div className="flex items-center gap-0.25">
      <span className="py-1">The domain is invalid or not configured</span>
      <SentryAppLink
        to={{
          url: `/settings/projects/${projectIdOrSlug}/toolbar/`,
          query: {
            domain: window.location.host,
          },
        }}>
        Configure project
      </SentryAppLink>
    </div>
  );
}
