import {cx} from 'cva';
import {useContext} from 'react';
import SentryAppLink from 'toolbar/components/SentryAppLink';
import UnauthPill from 'toolbar/components/unauth/UnauthPill';
import ConfigContext from 'toolbar/context/ConfigContext';
import {getSentryWebOrigin} from 'toolbar/sentryApi/urls';

const buttonClass = cx('rounded-full text-white p-1 hover:bg-gray-500 hover:underline');

export default function InvalidDomain() {
  const config = useContext(ConfigContext);
  const {projectIdOrSlug} = config;

  return (
    <UnauthPill>
      <div className="flex gap-0.25">
        <span className="py-1">The domain is invalid or not configured</span>
        <SentryAppLink
          className={buttonClass}
          to={{
            url: `${getSentryWebOrigin(config)}/settings/projects/${projectIdOrSlug}/toolbar/`,
          }}>
          Configure project
        </SentryAppLink>
      </div>
    </UnauthPill>
  );
}
