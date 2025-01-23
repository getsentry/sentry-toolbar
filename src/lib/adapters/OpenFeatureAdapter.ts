import {type Provider} from '@openfeature/web-sdk';
import {getLocalStorage, clearLocalStorage, setLocalStorage} from 'toolbar/adapters/localStorage';
import type {FeatureFlagAdapter, FlagMap, FlagValue} from 'toolbar/types/featureFlags';

interface Opts {
  provider: Provider;
}

export default function OpenFeatureAdapter(opts: Opts): FeatureFlagAdapter {
  return {
    getFlagMap(): FlagMap {
      return flagsFromProvider(opts.provider);
    },
    getOverrides(): FlagMap {
      return getLocalStorage();
    },
    setOverride(name: string, value: FlagValue) {
      const prev = getLocalStorage();
      const updated: FlagMap = {...prev, [name]: value};
      setLocalStorage(updated);
    },
    clearOverrides: clearLocalStorage,
    // TODO: implement `urlTemplate(name: string): string` depending on if we
    // can detect the provider type.
  };
}

function flagsFromProvider(provider: Provider): FlagMap {
  if ('_flags' in provider) {
    const flags = provider._flags as Record<FlagEntry[0], FlagEntry[1]>;
    console.log('flagsFromProvider', flags);
    return flagEntriesToFlags(Object.entries(flags));
  }
  if ('_flagCache' in provider) {
    const flags = provider._flagCache as Record<FlagEntry[0], FlagEntry[1]>;
    console.log('flagsFromProvider', flags);
    return flagEntriesToFlags(Object.entries(flags));
  }
  return {};
}

function flagEntriesToFlags(entries: FlagEntry[]): FlagMap {
  return entries.reduce((acc: FlagMap, entry: FlagEntry) => {
    if (isBooleanValue(entry) || isStringValue(entry) || isNumberValue(entry)) {
      acc[entry[0]] = entry[1].value;
    }
    return acc;
  }, {});
}

type FlagEntry<T = unknown> = [string, {type?: unknown; value?: T}];

function isBooleanValue(entry: FlagEntry): entry is FlagEntry<boolean> {
  const [, meta] = entry;
  return meta.type === 'boolValue' || typeof meta.value === 'boolean';
}

function isStringValue(entry: FlagEntry): entry is FlagEntry<string> {
  const [, meta] = entry;
  return meta.type === 'stringValue' || typeof meta.value === 'string';
}

function isNumberValue(entry: FlagEntry): entry is FlagEntry<number> {
  const [, meta] = entry;
  return meta.type === 'numberValue' || typeof meta.value === 'number';
}
