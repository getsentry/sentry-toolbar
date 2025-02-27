import type {Locale} from 'date-fns';
import {formatDistanceToNowStrict} from 'date-fns/formatDistanceToNowStrict';
import {useCallback, useEffect, useRef} from 'react';
import {Tooltip, TooltipContent, TooltipTrigger} from 'toolbar/components/base/tooltip/Tooltip';
import useFetchSentryData from 'toolbar/hooks/fetch/useFetchSentryData';
import {useUserQuery} from 'toolbar/sentryApi/queryKeys';
import {localeDataTimeFormatter} from 'toolbar/utils/locale';

interface Props {
  date: Date;
  locale?: Locale;
  updateInterval?: 'second' | 'minute' | 'hour';
}

export default function RelativeDateTime({date, locale, updateInterval}: Props) {
  const elem = useRef<HTMLTimeElement>(null);
  const timeout = useRef<number | null>(null);

  const {data: me} = useFetchSentryData(useUserQuery('me'));

  const getDistance = useCallback(
    () =>
      formatDistanceToNowStrict(date, {
        roundingMethod: 'floor',
        addSuffix: true,
        locale,
      }),
    [date, locale]
  );

  useEffect(() => {
    const timeoutDuration = intervalToTimeout(updateInterval ?? getRecommendedInterval(date));
    const createTimeout = () =>
      window.setTimeout(() => {
        if (elem.current) {
          elem.current.innerText = getDistance();
        }
        timeout.current = createTimeout();
      }, timeoutDuration);

    timeout.current = createTimeout();

    return () => {
      if (timeout.current) {
        window.clearTimeout(timeout.current);
        timeout.current = null;
      }
    };
  }, [date, getDistance, updateInterval]);

  return (
    <Tooltip>
      <TooltipTrigger>
        <time ref={elem} dateTime={date.toISOString()} dangerouslySetInnerHTML={{__html: getDistance()}} />
      </TooltipTrigger>
      <TooltipContent>{localeDataTimeFormatter(me?.json, {}).format(date)}</TooltipContent>
    </Tooltip>
  );
}

enum DurationInMS {
  SECOND = 1_000,
  MINUTE = 1_000 * 60,
  HOUR = 1_000 * 60 * 60,
}

function getRecommendedInterval(date: Date): NonNullable<Props['updateInterval']> {
  const difference = Math.abs(Date.now() - date.getTime());
  if (difference < DurationInMS.MINUTE) {
    return 'second';
  } else if (difference < DurationInMS.HOUR) {
    return 'minute';
  } else {
    return 'hour';
  }
}

function intervalToTimeout(interval: NonNullable<Props['updateInterval']>) {
  if (interval === 'second') {
    return DurationInMS.SECOND;
  } else if (interval === 'minute') {
    return DurationInMS.MINUTE;
  } else if (interval === 'hour') {
    return DurationInMS.HOUR;
  }
}
