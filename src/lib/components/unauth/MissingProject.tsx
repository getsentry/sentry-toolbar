import {UnauthPillAppLink} from 'toolbar/components/unauth/UnauthPill';
import {useConfigContext} from 'toolbar/context/ConfigContext';

export default function MissingProject() {
  const [{projectIdOrSlug}] = useConfigContext();

  return (
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
  );
}
