import PlatformIcon from 'toolbar/components/icon/PlatformIcon';
import useFetchSentryData from 'toolbar/hooks/fetch/useFetchSentryData';
import {useProjectQuery} from 'toolbar/sentryApi/queryKeys';

interface Props {
  size?: React.ComponentProps<typeof PlatformIcon>['size'];
  organizationSlug: string;
  projectIdOrSlug: string | number;
}

export default function ProjectIcon({size, organizationSlug, projectIdOrSlug}: Props) {
  const {data, isSuccess} = useFetchSentryData({
    ...useProjectQuery(String(organizationSlug), String(projectIdOrSlug)),
  });

  return <PlatformIcon size={size} isLoading={!isSuccess} platform={data?.json.platform ?? 'default'} />;
}