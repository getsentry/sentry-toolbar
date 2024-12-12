import type {Dispatch, ReactNode, SetStateAction} from 'react';
import {createContext, useCallback, useContext, useEffect, useState} from 'react';
import type {Prefilter} from 'toolbar/components/panels/featureFlags/FeatureFlagsPanel';
import type {FeatureFlagAdapter, FlagMap, FlagValue} from 'toolbar/types/featureFlags';

interface Context {
  overridesFingerprint: string;

  /**
   * Call through to the user-supplied clearOverrides() function to reset override state.
   */
  clearOverrides: () => void;

  /**
   * All the original flags from the Provider
   */
  flags: FlagMap;

  /**
   * Whether the state of overridden flags has changed in this session. After
   * state is changed you must reload the page to ensure that you're getting a
   * consistent experience.
   */
  isDirty: boolean;

  /**
   * Overridden flags from the adapter
   */
  overrides: FlagMap;

  /**
   * Whether we're showing all flags, or only overridden ones
   */
  prefilter: Prefilter;

  /**
   * What flag names to search/filter for.
   *
   * The filter is case-insensitive, with partial name matching.
   */
  searchTerm: string;

  /**
   * Set an override. Marks the state as dirty.
   *
   * Setting an override back to default will not un-mark the dirty flag.
   */
  setOverride: (name: string, value: FlagValue) => void;

  /**
   * Set whether to show & filter by all flags, or only overridden ones
   */
  setPrefilter: Dispatch<SetStateAction<Prefilter>>;

  /**
   * Set the search term for flags.
   *
   * Flags are compared case-insensitively
   */
  setSearchTerm: Dispatch<SetStateAction<string>>;

  /**
   * The URL Template implementation that was passed in
   */
  urlTemplate: FeatureFlagAdapter['urlTemplate'];

  /**
   * The rows that match both the prefilter, and the search term.
   */
  visibleFlagNames: string[];
}

const FeatureFlagContext = createContext<Context>({
  overridesFingerprint: '',
  clearOverrides: () => {},
  flags: {},
  isDirty: false,
  overrides: {},
  prefilter: 'all',
  searchTerm: '',
  setOverride: () => {},
  setPrefilter: () => {},
  setSearchTerm: () => {},
  urlTemplate: () => undefined,
  visibleFlagNames: [],
});

interface Props {
  children: ReactNode;
  featureFlags: FeatureFlagAdapter;
}

export function FeatureFlagsContextProvider({children, featureFlags}: Props) {
  const [flags, setFlags] = useState<FlagMap>({});
  const flagsPromise = Promise.resolve(featureFlags.getFlagMap());
  useEffect(() => {
    flagsPromise.then(setFlags);
  }, [flagsPromise]);

  const [overrides, setOverrides] = useState<FlagMap>({});
  const overridesPromise = Promise.resolve(featureFlags.getOverrides());
  useEffect(() => {
    overridesPromise.then(setOverrides);
  }, [overridesPromise]);

  const [overridesFingerprint, setOverrideFingerprint] = useState<string>(() => JSON.stringify(overrides));

  const [isDirty, setIsDirty] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [prefilter, setPrefilter] = useState<Prefilter>('all');

  const refresh = useCallback(() => {
    setIsDirty(true);
    setOverrideFingerprint(JSON.stringify(featureFlags.getOverrides()));
  }, [featureFlags]);

  const setOverride = useCallback(
    (name: string, value: FlagValue) => {
      featureFlags.setOverride(name, value);
      refresh();
    },
    [featureFlags, refresh]
  );

  const clearOverrides = useCallback(() => {
    featureFlags.clearOverrides?.();
    refresh();
  }, [featureFlags, refresh]);

  const overrideOnly = prefilter === 'overrides';
  const visibleFlagNames = overrideOnly
    ? Object.keys(overrides)
    : Array.from(new Set([...Object.keys(overrides), ...Object.keys(flags)]));

  return (
    <FeatureFlagContext.Provider
      value={{
        overridesFingerprint,
        clearOverrides,
        flags,
        isDirty,
        overrides,
        prefilter,
        searchTerm,
        setOverride,
        setPrefilter,
        setSearchTerm,
        urlTemplate: featureFlags.urlTemplate,
        visibleFlagNames,
      }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlagsContext() {
  return useContext(FeatureFlagContext);
}
