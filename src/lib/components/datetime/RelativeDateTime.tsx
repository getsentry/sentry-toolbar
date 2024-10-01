import {formatDistanceToNowStrict} from 'date-fns/formatDistanceToNowStrict';

export default function RelativeDateTime({date}: {date: Date}) {
  return (
    <time dateTime={date.toISOString()}>
      {formatDistanceToNowStrict(date, {addSuffix: true, roundingMethod: 'floor'})}
    </time>
  );
}
