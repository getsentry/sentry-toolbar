import {renderHook} from '@testing-library/react';
import useSentryClientAndScope from 'toolbar/hooks/useSentryClientAndScope';

describe('useSentryClientAndScope', () => {
  const originalSentry = (window as unknown as {__SENTRY__?: unknown}).__SENTRY__;

  afterEach(() => {
    if (originalSentry !== undefined) {
      (window as unknown as {__SENTRY__: unknown}).__SENTRY__ = originalSentry;
    } else {
      delete (window as unknown as {__SENTRY__?: unknown}).__SENTRY__;
    }
  });

  describe('when window.__SENTRY__ is not defined', () => {
    it('returns undefined for both scope and client', () => {
      delete (window as unknown as {__SENTRY__?: unknown}).__SENTRY__;

      const {result} = renderHook(() => useSentryClientAndScope());

      expect(result.current.scope).toBeUndefined();
      expect(result.current.client).toBeUndefined();
    });
  });

  describe('v8.6.0+ carrier structure', () => {
    it('returns scope from versioned carrier', () => {
      const mockScope = {id: 'mock-scope'};
      (window as unknown as {__SENTRY__: unknown}).__SENTRY__ = {
        version: '8.6.0',
        '8.6.0': {
          stack: {
            getScope: () => mockScope,
          },
        },
      };

      const {result} = renderHook(() => useSentryClientAndScope());

      expect(result.current.scope).toBe(mockScope);
    });

    it('returns client from versioned carrier scope', () => {
      const mockClient = {id: 'mock-client'};
      const mockScope = {
        id: 'mock-scope',
        getClient: () => mockClient,
      };
      (window as unknown as {__SENTRY__: unknown}).__SENTRY__ = {
        version: '8.6.0',
        '8.6.0': {
          stack: {
            getScope: () => mockScope,
          },
        },
      };

      const {result} = renderHook(() => useSentryClientAndScope());

      expect(result.current.client).toBe(mockClient);
    });

    it('returns undefined client when scope has no getClient method', () => {
      const mockScope = {id: 'mock-scope'};
      (window as unknown as {__SENTRY__: unknown}).__SENTRY__ = {
        version: '8.6.0',
        '8.6.0': {
          stack: {
            getScope: () => mockScope,
          },
        },
      };

      const {result} = renderHook(() => useSentryClientAndScope());

      expect(result.current.scope).toBe(mockScope);
      expect(result.current.client).toBeUndefined();
    });

    it('handles missing getScope function in versioned carrier', () => {
      (window as unknown as {__SENTRY__: unknown}).__SENTRY__ = {
        version: '8.6.0',
        '8.6.0': {
          stack: {},
        },
      };

      const {result} = renderHook(() => useSentryClientAndScope());

      expect(result.current.scope).toBeUndefined();
      expect(result.current.client).toBeUndefined();
    });

    it('handles missing stack in versioned carrier', () => {
      (window as unknown as {__SENTRY__: unknown}).__SENTRY__ = {
        version: '8.6.0',
        '8.6.0': {},
      };

      const {result} = renderHook(() => useSentryClientAndScope());

      expect(result.current.scope).toBeUndefined();
      expect(result.current.client).toBeUndefined();
    });

    it('handles missing versioned carrier object', () => {
      (window as unknown as {__SENTRY__: unknown}).__SENTRY__ = {
        version: '8.6.0',
      };

      const {result} = renderHook(() => useSentryClientAndScope());

      expect(result.current.scope).toBeUndefined();
      expect(result.current.client).toBeUndefined();
    });

    it('works with different version strings', () => {
      const mockScope = {id: 'mock-scope'};
      (window as unknown as {__SENTRY__: unknown}).__SENTRY__ = {
        version: '8.10.0',
        '8.10.0': {
          stack: {
            getScope: () => mockScope,
          },
        },
      };

      const {result} = renderHook(() => useSentryClientAndScope());

      expect(result.current.scope).toBe(mockScope);
    });
  });

  describe('pre-8.6.0 (v7) carrier structure', () => {
    it('returns scope from hub', () => {
      const mockScope = {id: 'mock-scope'};
      (window as unknown as {__SENTRY__: unknown}).__SENTRY__ = {
        hub: {
          getScope: () => mockScope,
        },
      };

      const {result} = renderHook(() => useSentryClientAndScope());

      expect(result.current.scope).toBe(mockScope);
    });

    it('returns client from hub', () => {
      const mockClient = {id: 'mock-client'};
      const mockScope = {id: 'mock-scope'};
      (window as unknown as {__SENTRY__: unknown}).__SENTRY__ = {
        hub: {
          getScope: () => mockScope,
          getClient: () => mockClient,
        },
      };

      const {result} = renderHook(() => useSentryClientAndScope());

      expect(result.current.client).toBe(mockClient);
    });

    it('handles hub with missing getScope', () => {
      (window as unknown as {__SENTRY__: unknown}).__SENTRY__ = {
        hub: {},
      };

      const {result} = renderHook(() => useSentryClientAndScope());

      expect(result.current.scope).toBeUndefined();
    });

    it('handles hub with missing getClient', () => {
      const mockScope = {id: 'mock-scope'};
      (window as unknown as {__SENTRY__: unknown}).__SENTRY__ = {
        hub: {
          getScope: () => mockScope,
        },
      };

      const {result} = renderHook(() => useSentryClientAndScope());

      expect(result.current.scope).toBe(mockScope);
      expect(result.current.client).toBeUndefined();
    });
  });

  describe('priority between v8 and legacy carrier', () => {
    it('prefers v8 carrier when both are present', () => {
      const v8Scope = {id: 'v8-scope'};
      const legacyScope = {id: 'legacy-scope'};
      (window as unknown as {__SENTRY__: unknown}).__SENTRY__ = {
        version: '8.6.0',
        '8.6.0': {
          stack: {
            getScope: () => v8Scope,
          },
        },
        hub: {
          getScope: () => legacyScope,
        },
      };

      const {result} = renderHook(() => useSentryClientAndScope());

      expect(result.current.scope).toBe(v8Scope);
    });

    it('falls back to legacy when v8 version exists but versioned carrier is empty', () => {
      const legacyScope = {id: 'legacy-scope'};
      (window as unknown as {__SENTRY__: unknown}).__SENTRY__ = {
        version: '8.6.0',
        '8.6.0': {
          stack: {},
        },
        hub: {
          getScope: () => legacyScope,
        },
      };

      const {result} = renderHook(() => useSentryClientAndScope());

      // v8 path returns undefined, but doesn't fall back to legacy
      expect(result.current.scope).toBeUndefined();
    });
  });

  describe('empty carrier object', () => {
    it('returns undefined for both when carrier is empty object', () => {
      (window as unknown as {__SENTRY__: unknown}).__SENTRY__ = {};

      const {result} = renderHook(() => useSentryClientAndScope());

      expect(result.current.scope).toBeUndefined();
      expect(result.current.client).toBeUndefined();
    });
  });
});
