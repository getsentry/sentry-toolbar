import {cx} from 'cva';
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
    const redPlaceholderClass = Placeholder({
      height: 'text',
      width: 'auto',
      state: isError ? 'normal' : 'error',
    });
    return (
      <Media
        media={
          <div
            className={Placeholder({
              height: 'full',
              width: 'full',
              shape: 'round',
              state: isError ? 'normal' : 'error',
            })}
          />
        }
        title={<div className={cx(redPlaceholderClass, 'w-160px')} />}
        description={<div className={cx(redPlaceholderClass, 'w-120px')} />}
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
