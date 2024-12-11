import {renderHook} from '@testing-library/react';
import usePrevious from 'toolbar/hooks/usePrevious';

describe('usePrevious', () => {
  it('stores initial value', () => {
    const {result} = renderHook(usePrevious, {initialProps: 'Initial Value'});
    expect(result.current).toBe('Initial Value');
  });

  it('provides initial value', () => {
    const {result} = renderHook(usePrevious, {
      initialProps: 'Initial Value',
    });

    expect(result.current).toBe('Initial Value');
  });

  it('provides previous value', () => {
    const {result, rerender} = renderHook(usePrevious<string | undefined>, {
      initialProps: undefined,
    });

    rerender('New Value');
    // We did not pass anything under initialProps
    expect(result.current).toBe(undefined);
    rerender('New New Value');
    // Result should point to old value
    expect(result.current).toBe('New Value');
  });
});
