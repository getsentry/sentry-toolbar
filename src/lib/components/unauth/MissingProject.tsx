import {useContext} from 'react';
import UnauthPill, {UnauthPillAppLink} from 'toolbar/components/unauth/UnauthPill';
import ConfigContext from 'toolbar/context/ConfigContext';

export default function MissingProject() {
  const {projectIdOrSlug} = useContext(ConfigContext);

  return (
    <UnauthPill>
      <div className="flex gap-0.25">
        <span className="py-1">Missing Project</span>
        <UnauthPillAppLink
          to={{
            url: '/settings/projects/',
            query: {query: projectIdOrSlug},
          }}>
          Open project list
        </UnauthPillAppLink>
      </div>
    </UnauthPill>
  );
}
