import {UnauthPillAppLink} from 'toolbar/components/unauth/UnauthPill';
import {useConfigContext} from 'toolbar/context/ConfigContext';

export default function InvalidDomain() {
  const [{projectIdOrSlug}] = useConfigContext();

  return (
    <div className="flex gap-0.25">
      <span className="py-1">The domain is invalid or not configured</span>
      <UnauthPillAppLink
        to={{
          url: `/settings/projects/${projectIdOrSlug}/toolbar/`,
          query: {
            domain: window.location.host,
          },
        }}>
        Configure project
      </UnauthPillAppLink>
    </div>
  );
}
