import {renderHook, act} from '@testing-library/react';
import useWindowKeyValueSync from 'toolbar/hooks/useWindowKeyValueSync';

describe('useWindowKeyValueSync', () => {
  it('calls callback when an event with matching key is dispatched', () => {
    const callback = jest.fn();
    const {result} = renderHook(() => useWindowKeyValueSync({key: 'test-key', callback}));

    act(() => {
      result.current('test-value');
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('test-value');
  });

  it('does not call callback when an event with a different key is dispatched', () => {
    const callback = jest.fn();
    renderHook(() => useWindowKeyValueSync({key: 'my-key', callback}));

    act(() => {
      window.dispatchEvent(
        new CustomEvent('synced-key-value', {
          detail: {key: 'other-key', value: 'some-value'},
        })
      );
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('does not call callback for unrelated events', () => {
    const callback = jest.fn();
    renderHook(() => useWindowKeyValueSync({key: 'my-key', callback}));

    act(() => {
      window.dispatchEvent(new CustomEvent('unrelated-event', {detail: {}}));
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('handles complex object values', () => {
    const callback = jest.fn();
    const {result} = renderHook(() =>
      useWindowKeyValueSync<{name: string; count: number}>({
        key: 'object-key',
        callback,
      })
    );

    const complexValue = {name: 'test', count: 42};
    act(() => {
      result.current(complexValue);
    });

    expect(callback).toHaveBeenCalledWith(complexValue);
  });

  it('allows multiple hooks with different keys to work independently', () => {
    const callbackA = jest.fn();
    const callbackB = jest.fn();

    const {result: resultA} = renderHook(() => useWindowKeyValueSync({key: 'key-a', callback: callbackA}));
    renderHook(() => useWindowKeyValueSync({key: 'key-b', callback: callbackB}));

    act(() => {
      resultA.current('value-for-a');
    });

    expect(callbackA).toHaveBeenCalledWith('value-for-a');
    expect(callbackB).not.toHaveBeenCalled();
  });

  it('cleans up event listener on unmount', () => {
    const callback = jest.fn();
    const {unmount} = renderHook(() => useWindowKeyValueSync({key: 'cleanup-key', callback}));

    unmount();

    act(() => {
      window.dispatchEvent(
        new CustomEvent('synced-key-value', {
          detail: {key: 'cleanup-key', value: 'after-unmount'},
        })
      );
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('returns a stable dispatch function when key does not change', () => {
    const callback = jest.fn();
    const {result, rerender} = renderHook(() => useWindowKeyValueSync({key: 'stable-key', callback}));

    const firstDispatch = result.current;
    rerender();
    const secondDispatch = result.current;

    expect(firstDispatch).toBe(secondDispatch);
  });

  it('updates event listener when callback changes', () => {
    const callbackA = jest.fn();
    const callbackB = jest.fn();

    const {result, rerender} = renderHook(({callback}) => useWindowKeyValueSync({key: 'update-key', callback}), {
      initialProps: {callback: callbackA},
    });

    rerender({callback: callbackB});

    act(() => {
      result.current('new-value');
    });

    expect(callbackA).not.toHaveBeenCalled();
    expect(callbackB).toHaveBeenCalledWith('new-value');
  });

  it('updates event listener when key changes', () => {
    const callback = jest.fn();

    const {result, rerender} = renderHook(({key}) => useWindowKeyValueSync({key, callback}), {
      initialProps: {key: 'old-key'},
    });

    rerender({key: 'new-key'});

    // Dispatch to old key should not trigger callback
    act(() => {
      window.dispatchEvent(
        new CustomEvent('synced-key-value', {
          detail: {key: 'old-key', value: 'old-value'},
        })
      );
    });
    expect(callback).not.toHaveBeenCalled();

    // Dispatch to new key should trigger callback
    act(() => {
      result.current('new-value');
    });
    expect(callback).toHaveBeenCalledWith('new-value');
  });
});
