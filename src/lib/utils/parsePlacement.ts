import type {Configuration} from 'toolbar/types/Configuration';

type Major = 'top' | 'bottom' | 'left' | 'right';
type Minor = 'left' | 'right' | 'top' | 'bottom' | 'edge';

export default function parsePlacement(placement: Configuration['placement']): [major: Major, minor: Minor] {
  const [major, minor] = placement.split('-');
  return [(major ?? 'right') as Major, (minor ?? 'edge') as Minor];
}
