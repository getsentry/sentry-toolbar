import {useContext} from 'react';
import UnauthPill, {UnauthPillAppLink} from 'toolbar/components/unauth/UnauthPill';
import ConfigContext from 'toolbar/context/ConfigContext';

export default function InvalidDomain() {
  const config = useContext(ConfigContext);
  const {projectIdOrSlug} = config;

  return (
    <UnauthPill>
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
    </UnauthPill>
  );
}
