import type {Scope} from '@sentry/core';
import {renderHook} from '@testing-library/react';
import useCurrentSentryTransactionName from 'toolbar/hooks/useCurrentSentryTransactionName';
import useSentryClientAndScope from 'toolbar/hooks/useSentryClientAndScope';

jest.mock('toolbar/hooks/useSentryClientAndScope');

const mockUseSentryClientAndScope = jest.mocked(useSentryClientAndScope);

describe('useCurrentSentryTransactionName', () => {
  const originalLocation = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  beforeEach(() => {
    window.history.replaceState({}, '', '/projects/123/issues');
    mockUseSentryClientAndScope.mockReturnValue({scope: undefined, client: undefined});
  });

  afterEach(() => {
    window.history.replaceState({}, '', originalLocation);
    jest.clearAllMocks();
  });

  it('uses the current pathname when the Sentry SDK is unavailable', () => {
    const {result} = renderHook(() => useCurrentSentryTransactionName());

    expect(result.current).toBe('/projects/*/issues');
  });

  it('prefers the current Sentry transaction name', () => {
    const scope = {
      getScopeData: () => ({transactionName: '/organizations/456/settings'}),
    } as unknown as Scope;
    mockUseSentryClientAndScope.mockReturnValue({scope, client: undefined});

    const {result} = renderHook(() => useCurrentSentryTransactionName());

    expect(result.current).toBe('/organizations/*/settings');
  });

  it('uses the current pathname when the Sentry transaction name is empty', () => {
    const scope = {
      getScopeData: () => ({transactionName: ''}),
    } as unknown as Scope;
    mockUseSentryClientAndScope.mockReturnValue({scope, client: undefined});

    const {result} = renderHook(() => useCurrentSentryTransactionName());

    expect(result.current).toBe('/projects/*/issues');
  });
});
