import {renderHook, act} from '@testing-library/react';
import {useLocalStorage, useSessionStorage} from 'toolbar/hooks/useStorage';
import {localStorage, sessionStorage} from 'toolbar/utils/storage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.removeItem('test-key');
  });

  it('returns initial value when storage is empty', () => {
    const {result} = renderHook(() => useLocalStorage('test-key', 'initial'));

    expect(result.current[0]).toBe('initial');
  });

  it('returns stored value when storage has data', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'));

    const {result} = renderHook(() => useLocalStorage('test-key', 'initial'));

    expect(result.current[0]).toBe('stored-value');
  });

  it('supports initial value as a function', () => {
    const initializer = jest.fn(() => 'computed-initial');

    const {result} = renderHook(() => useLocalStorage('test-key', initializer));

    expect(result.current[0]).toBe('computed-initial');
    expect(initializer).toHaveBeenCalledTimes(1);
  });

  it('updates state and persists to storage', () => {
    const {result} = renderHook(() => useLocalStorage<string>('test-key', 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(JSON.parse(localStorage.getItem('test-key')!)).toBe('new-value');
  });

  it('handles complex object values', () => {
    const initialValue = {name: 'test', count: 0};
    const {result} = renderHook(() => useLocalStorage('test-key', initialValue));

    const newValue = {name: 'updated', count: 42};
    act(() => {
      result.current[1](newValue);
    });

    expect(result.current[0]).toEqual(newValue);
    expect(JSON.parse(localStorage.getItem('test-key')!)).toEqual(newValue);
  });

  it('handles array values', () => {
    const {result} = renderHook(() => useLocalStorage<string[]>('test-key', []));

    act(() => {
      result.current[1](['a', 'b', 'c']);
    });

    expect(result.current[0]).toEqual(['a', 'b', 'c']);
    expect(JSON.parse(localStorage.getItem('test-key')!)).toEqual(['a', 'b', 'c']);
  });

  it('returns initial value when storage contains invalid JSON', () => {
    localStorage.setItem('test-key', 'not-valid-json');

    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    const {result} = renderHook(() => useLocalStorage('test-key', 'fallback'));

    expect(result.current[0]).toBe('fallback');
    expect(consoleError).toHaveBeenCalled();

    consoleError.mockRestore();
  });

  it('syncs value across multiple hook instances via window events', () => {
    const {result: result1} = renderHook(() => useLocalStorage<string>('test-key', 'initial'));
    const {result: result2} = renderHook(() => useLocalStorage<string>('test-key', 'initial'));

    act(() => {
      result1.current[1]('synced-value');
    });

    expect(result1.current[0]).toBe('synced-value');
    expect(result2.current[0]).toBe('synced-value');
  });

  it('does not sync values between different keys', () => {
    const {result: resultA} = renderHook(() => useLocalStorage<string>('key-a', 'initial-a'));
    const {result: resultB} = renderHook(() => useLocalStorage<string>('key-b', 'initial-b'));

    act(() => {
      resultA.current[1]('new-a');
    });

    expect(resultA.current[0]).toBe('new-a');
    expect(resultB.current[0]).toBe('initial-b');
  });

  it('returns stable setter function', () => {
    const {result, rerender} = renderHook(() => useLocalStorage<string>('test-key', 'initial'));

    const firstSetter = result.current[1];
    rerender();
    const secondSetter = result.current[1];

    expect(firstSetter).toBe(secondSetter);
  });

  it('handles boolean values', () => {
    const {result} = renderHook(() => useLocalStorage<boolean>('test-key', false));

    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1](true);
    });

    expect(result.current[0]).toBe(true);
    expect(JSON.parse(localStorage.getItem('test-key')!)).toBe(true);
  });

  it('handles null values', () => {
    const {result} = renderHook(() => useLocalStorage<string | null>('test-key', 'initial'));

    act(() => {
      result.current[1](null);
    });

    expect(result.current[0]).toBe(null);
    expect(JSON.parse(localStorage.getItem('test-key')!)).toBe(null);
  });

  it('handles numeric values', () => {
    const {result} = renderHook(() => useLocalStorage<number>('test-key', 0));

    act(() => {
      result.current[1](42);
    });

    expect(result.current[0]).toBe(42);
    expect(JSON.parse(localStorage.getItem('test-key')!)).toBe(42);
  });
});

describe('useSessionStorage', () => {
  beforeEach(() => {
    sessionStorage.removeItem('test-key');
  });

  it('returns initial value when storage is empty', () => {
    const {result} = renderHook(() => useSessionStorage('test-key', 'initial'));

    expect(result.current[0]).toBe('initial');
  });

  it('returns stored value when storage has data', () => {
    sessionStorage.setItem('test-key', JSON.stringify('stored-value'));

    const {result} = renderHook(() => useSessionStorage('test-key', 'initial'));

    expect(result.current[0]).toBe('stored-value');
  });

  it('updates state and persists to storage', () => {
    const {result} = renderHook(() => useSessionStorage<string>('test-key', 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(JSON.parse(sessionStorage.getItem('test-key')!)).toBe('new-value');
  });

  it('syncs value across multiple hook instances via window events', () => {
    const {result: result1} = renderHook(() => useSessionStorage<string>('test-key', 'initial'));
    const {result: result2} = renderHook(() => useSessionStorage<string>('test-key', 'initial'));

    act(() => {
      result1.current[1]('synced-value');
    });

    expect(result1.current[0]).toBe('synced-value');
    expect(result2.current[0]).toBe('synced-value');
  });
});
