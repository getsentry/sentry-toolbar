import {cx} from 'cva';
import {useContext} from 'react';
import SentryAppLink from 'toolbar/components/SentryAppLink';
import UnauthPill from 'toolbar/components/unauth/UnauthPill';
import ConfigContext from 'toolbar/context/ConfigContext';

const buttonClass = cx('rounded-full p-1 hover:bg-gray-500 hover:underline');

export default function MissingProject() {
  const {projectIdOrSlug} = useContext(ConfigContext);

  return (
    <UnauthPill>
      <div className="flex gap-0.25">
        <span className="py-1">Missing Project</span>
        <SentryAppLink
          className={buttonClass}
          to={{
            url: '/settings/projects/',
            query: {query: projectIdOrSlug},
          }}>
          Open project list
        </SentryAppLink>
      </div>
    </UnauthPill>
  );
}
