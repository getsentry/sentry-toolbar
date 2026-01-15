import SentryAppLink from 'toolbar/components/base/SentryAppLink';
import {useConfigContext} from 'toolbar/context/ConfigContext';

export default function MissingProject() {
  const [{projectIdOrSlug}] = useConfigContext();

  return (
    <div className="flex flex-col gap-0.25">
      <p>Missing Project</p>
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
