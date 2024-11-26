import type {FormatDistanceToken} from 'date-fns';
import {formatDistanceToNowStrict} from 'date-fns/formatDistanceToNowStrict';
import {useCallback, useEffect, useRef} from 'react';

interface Props {
  date: Date;
  suffix: string;
  updateInterval?: 'second' | 'minute' | 'hour';
}

export default function RelativeDateTime({date, suffix, updateInterval}: Props) {
  const elem = useRef<HTMLTimeElement>(null);

  const timeout = useRef<number | null>(null);

  const getDistance = useCallback(
    () =>
      formatDistanceToNowStrict(date, {
        roundingMethod: 'floor',
        locale: {
          formatDistance: (token: FormatDistanceToken, count: number) => {
            const formatMap: Partial<Record<FormatDistanceToken, string>> = {
              xSeconds: `${count}s ${suffix}`,
              xMinutes: `${count}min ${suffix}`,
              xHours: `${count}hr ${suffix}`,
              xDays: `${count}d ${suffix}`,
              xWeeks: `${count}w ${suffix}`,
              xMonths: `${count}mo ${suffix}`,
              xYears: `${count}y ${suffix}`,
            };
            return formatMap[token] || `${count}d`;
          },
        },
      }),
    [date, suffix]
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

  return <time ref={elem} dateTime={date.toISOString()} dangerouslySetInnerHTML={{__html: getDistance()}}></time>;
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
