import type {Dispatch, ReactNode, SetStateAction} from 'react';
import {createContext, useCallback, useContext, useState} from 'react';
import type {Prefilter} from 'toolbar/components/panels/featureFlags/FeatureFlagsPanel';
import type {FeatureFlagAdapter, FlagOverrides, FlagValue} from 'toolbar/types/featureFlags';

interface Context {
  /**
   * Call through to the user-supplied clearOverrides() function to reset override state.
   */
  clearOverrides: () => void;

  /**
   * Whether the state of overridden flags has changed in this session. After
   * state is changed you must reload the page to ensure that you're getting a
   * consistent experience.
   */
  isDirty: boolean;

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
  visibleRows: [string, FlagOverrides[string]][];
}

const FeatureFlagContext = createContext<Context>({
  clearOverrides: () => {},
  isDirty: false,
  prefilter: 'all',
  searchTerm: '',
  setOverride: () => {},
  setPrefilter: () => {},
  setSearchTerm: () => {},
  urlTemplate: () => undefined,
  visibleRows: [],
});

interface Props {
  children: ReactNode;
  featureFlags: FeatureFlagAdapter;
}

export function FeatureFlagsContextProvider({children, featureFlags}: Props) {
  const [featureFlagOverrides, setFeatureFlagOverrides] = useState<FlagOverrides>(
    () => featureFlags.getOverrides?.() ?? {}
  );

  const [isDirty, setIsDirty] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [prefilter, setPrefilter] = useState<Prefilter>('all');

  const refresh = useCallback(() => {
    setIsDirty(true);
    setFeatureFlagOverrides(featureFlags.getOverrides?.() ?? {});
  }, [featureFlags]);

  const setOverride = useCallback(
    (name: string, value: FlagValue) => {
      featureFlags.setOverride?.(name, value);
      refresh();
    },
    [featureFlags, refresh]
  );

  const clearOverrides = useCallback(() => {
    featureFlags.clearOverrides?.();
    refresh();
  }, [featureFlags, refresh]);

  const visibleRows = Object.entries(featureFlagOverrides).filter(([name, flag]) => {
    const {value, override} = flag;
    const overrideOnly = prefilter === 'overrides';
    const isOverridden = override !== undefined && value !== override;
    const matchesSearch = name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase());
    return overrideOnly ? isOverridden && matchesSearch : matchesSearch;
  });

  return (
    <FeatureFlagContext.Provider
      value={{
        clearOverrides,
        isDirty,
        prefilter,
        searchTerm,
        setOverride,
        setPrefilter,
        setSearchTerm,
        urlTemplate: featureFlags.urlTemplate,
        visibleRows,
      }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlagsContext() {
  return useContext(FeatureFlagContext);
}
