import AvatarIcon from 'toolbar/components/avatar/AvatarIcon';
import Placeholder from 'toolbar/components/base/Placeholder';
import Media from 'toolbar/components/Media';
import useFetchSentryData from 'toolbar/hooks/fetch/useFetchSentryData';
import {useUserQuery} from 'toolbar/sentryApi/queryKeys';

export default function CurrentUser() {
  const {data, isError, isPending} = useFetchSentryData({
    ...useUserQuery('me'),
  });

  if (isPending || isError) {
    return (
      <Media
        media={<Placeholder height="full" width="full" shape="round" state={isError ? 'error' : 'normal'} />}
        title={<Placeholder height="text" state={isError ? 'error' : 'normal'} className="w-[160px]" />}
        description={<Placeholder height="text" state={isError ? 'error' : 'normal'} className="w-[120px]" />}
        size="lg"
      />
    );
  }

  const user = data.json;
  return (
    <Media
      media={
        <AvatarIcon name={user.name} avatarUrl={user.avatar.avatarUrl} type="user" tooltip={user.name} size="lg" />
      }
      title={user.name}
      description={user.email}
      size="lg"
    />
  );
}
