import type {FormatDistanceToken} from 'date-fns';
import {formatDistanceToNowStrict} from 'date-fns/formatDistanceToNowStrict';

export default function RelativeDateTime({date, suffix}: {date: Date; suffix: string}) {
  return (
    <time dateTime={date.toISOString()}>
      {formatDistanceToNowStrict(date, {
        addSuffix: true,
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
      })}
    </time>
  );
}
