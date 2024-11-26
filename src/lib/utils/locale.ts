import type {FormatDistanceFn, FormatDistanceFnOptions, FormatDistanceToken} from 'date-fns';
import {enUS} from 'date-fns/locale/en-US';

const distanceUnitAbbr: Record<FormatDistanceToken, string> = {
  lessThanXSeconds: '{{count}}s',
  xSeconds: '{{count}}s',
  halfAMinute: '30s',
  lessThanXMinutes: '{{count}}m',
  xMinutes: '{{count}}m',
  aboutXHours: '{{count}}h',
  xHours: '{{count}}h',
  xDays: '{{count}}d',
  aboutXWeeks: '{{count}}w',
  xWeeks: '{{count}}w',
  aboutXMonths: '{{count}}m',
  xMonths: '{{count}}m',
  aboutXYears: '{{count}}y',
  xYears: '{{count}}y',
  overXYears: '{{count}}y',
  almostXYears: '{{count}}y',
};

function makeFormatDistance(
  distanceUnitMap: Record<FormatDistanceToken, string>,
  futureTemplate: string,
  pastTemplate: string
): FormatDistanceFn {
  return (token: FormatDistanceToken, count: number, options: FormatDistanceFnOptions = {}): string => {
    const result = distanceUnitMap[token].replace('{{count}}', String(count));
    if (options.addSuffix) {
      return options.comparison === 1
        ? futureTemplate.replace('{{distance}}', result)
        : pastTemplate.replace('{{distance}}', result);
    }
    return result;
  };
}

export const localeTimeRelativeAbbr = {
  ...enUS,
  formatDistance: makeFormatDistance(distanceUnitAbbr, 'in {{distance}}', '{{distance}} ago'),
};

export const localeTimeAgeAbbr = {
  ...enUS,
  formatDistance: makeFormatDistance(distanceUnitAbbr, 'in {{distance}}', '{{distance}} old'),
};
