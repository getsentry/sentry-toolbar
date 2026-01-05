import {renderHook, act} from '@testing-library/react';
import useNavigationExpansion from 'toolbar/components/panels/nav/useNavigationExpansion';
import {localStorage} from 'toolbar/utils/storage';

const STORAGE_KEY = 'useNavigationExpansion_isPinned';

const mockUseLocation = jest.fn();
jest.mock('react-router-dom', () => ({
  useLocation: () => mockUseLocation(),
}));

describe('useNavigationExpansion', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.removeItem(STORAGE_KEY);
    mockUseLocation.mockReturnValue({pathname: '/'});
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('isExpanded', () => {
    it('returns false when on root path and not pinned, hovered, or delayed open', () => {
      const {result} = renderHook(() => useNavigationExpansion());

      expect(result.current.isExpanded).toBe(false);
    });

    it('returns true when pathname is not root', () => {
      mockUseLocation.mockReturnValue({pathname: '/issues'});

      const {result} = renderHook(() => useNavigationExpansion());

      expect(result.current.isExpanded).toBe(true);
    });

    it('returns true when isPinned is true', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(true));

      const {result} = renderHook(() => useNavigationExpansion());

      expect(result.current.isExpanded).toBe(true);
    });

    it('returns true when isHovered is true', () => {
      const {result} = renderHook(() => useNavigationExpansion());

      act(() => {
        result.current.setIsHovered(true);
      });

      expect(result.current.isExpanded).toBe(true);
    });

    it('returns true when isDelayedOpen is true (after hover ends)', () => {
      const {result} = renderHook(() => useNavigationExpansion());

      // Hover then unhover sets isDelayedOpen to true
      act(() => {
        result.current.setIsHovered(true);
      });
      act(() => {
        result.current.setIsHovered(false);
      });

      expect(result.current.isExpanded).toBe(true);
    });
  });

  describe('isPinned', () => {
    it('defaults to false', () => {
      const {result} = renderHook(() => useNavigationExpansion());

      expect(result.current.isPinned).toBe(false);
    });

    it('reads initial value from localStorage', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(true));

      const {result} = renderHook(() => useNavigationExpansion());

      expect(result.current.isPinned).toBe(true);
    });

    it('persists value to localStorage when set', () => {
      const {result} = renderHook(() => useNavigationExpansion());

      act(() => {
        result.current.setIsPinned(true);
      });

      expect(result.current.isPinned).toBe(true);
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')).toBe(true);
    });
  });

  describe('setIsHovered', () => {
    it('sets isExpanded to true when hovered', () => {
      const {result} = renderHook(() => useNavigationExpansion());

      expect(result.current.isExpanded).toBe(false);

      act(() => {
        result.current.setIsHovered(true);
      });

      expect(result.current.isExpanded).toBe(true);
    });

    it('sets isDelayedOpen to true when unhovered', () => {
      const {result} = renderHook(() => useNavigationExpansion());

      act(() => {
        result.current.setIsHovered(true);
      });
      act(() => {
        result.current.setIsHovered(false);
      });

      // isExpanded should still be true because of isDelayedOpen
      expect(result.current.isExpanded).toBe(true);
    });
  });

  describe('delayed close behavior', () => {
    it('closes after 2 seconds when not pinned and not hovered', () => {
      const {result} = renderHook(() => useNavigationExpansion());

      // Hover then unhover to trigger delayed close
      act(() => {
        result.current.setIsHovered(true);
      });
      act(() => {
        result.current.setIsHovered(false);
      });

      expect(result.current.isExpanded).toBe(true);

      // Advance time by 2 seconds
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(result.current.isExpanded).toBe(false);
    });

    it('does not close if hovered again before timeout', () => {
      const {result} = renderHook(() => useNavigationExpansion());

      // Hover then unhover
      act(() => {
        result.current.setIsHovered(true);
      });
      act(() => {
        result.current.setIsHovered(false);
      });

      // Advance partway through timeout
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Hover again
      act(() => {
        result.current.setIsHovered(true);
      });

      // Advance past original timeout
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      // Should still be expanded because we're hovering
      expect(result.current.isExpanded).toBe(true);
    });

    it('does not close if pinned', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(true));

      const {result} = renderHook(() => useNavigationExpansion());

      // Hover then unhover
      act(() => {
        result.current.setIsHovered(true);
      });
      act(() => {
        result.current.setIsHovered(false);
      });

      // Advance past timeout
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      // Should still be expanded because isPinned
      expect(result.current.isExpanded).toBe(true);
    });

    it('clears timeout when pinned while waiting to close', () => {
      const {result} = renderHook(() => useNavigationExpansion());

      // Hover then unhover to start timeout
      act(() => {
        result.current.setIsHovered(true);
      });
      act(() => {
        result.current.setIsHovered(false);
      });

      // Pin before timeout
      act(() => {
        result.current.setIsPinned(true);
      });

      // Advance past timeout
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      // Should still be expanded
      expect(result.current.isExpanded).toBe(true);
    });
  });
});
