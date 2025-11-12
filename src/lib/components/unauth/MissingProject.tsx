import SentryAppLink from 'toolbar/components/SentryAppLink';
import {useConfigContext} from 'toolbar/context/ConfigContext';

export default function MissingProject() {
  const [{projectIdOrSlug}] = useConfigContext();

  return (
    <div className="flex items-center gap-0.25">
      <span className="py-1">Missing Project</span>
      <SentryAppLink
        to={{
          url: '/settings/projects/',
          query: {query: projectIdOrSlug},
        }}>
        Open project list
      </SentryAppLink>
    </div>
  );
}
