import AvatarIcon from 'toolbar/components/avatar/AvatarIcon';
import Placeholder from 'toolbar/components/base/Placeholder';
import SentryAppLink from 'toolbar/components/base/SentryAppLink';
import {useConfigContext} from 'toolbar/context/ConfigContext';
import useFetchSentryData from 'toolbar/hooks/fetch/useFetchSentryData';
import {useOrganizationQuery} from 'toolbar/sentryApi/queryKeys';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  link?: boolean;
}

export default function CurrentOrg({size = 'md', link = true}: Props) {
  const [{organizationSlug}] = useConfigContext();
  const {data, isPending, isError} = useFetchSentryData({
    ...useOrganizationQuery(organizationSlug),
  });

  if (isPending || isError) {
    return (
      <div className="flex items-center gap-1">
        <Placeholder shape="round" state={isError ? 'error' : 'normal'} className="size-3" />
        <Placeholder height="text" state={isError ? 'error' : 'normal'} className="w-[160px]" />
      </div>
    );
  }

  const org = data.json;
  return (
    <div className="flex items-center gap-1">
      <AvatarIcon name={org.name} avatarUrl={org.avatar.avatarUrl} type="org" tooltip={org.name} size={size} />
      {link ? <SentryAppLink to={{url: `/organizations/${organizationSlug}/`}}>{org.name}</SentryAppLink> : org.name}
    </div>
  );
}
