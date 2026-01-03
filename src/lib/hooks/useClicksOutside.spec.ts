import {renderHook} from '@testing-library/react';
import useClicksOutside from 'toolbar/hooks/useClicksOutside';

describe('useClicksOutside', () => {
  let container: HTMLDivElement;
  let outsideElement: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.setAttribute('data-testid', 'container');
    document.body.appendChild(container);

    outsideElement = document.createElement('div');
    outsideElement.setAttribute('data-testid', 'outside');
    document.body.appendChild(outsideElement);
  });

  afterEach(() => {
    document.body.removeChild(container);
    document.body.removeChild(outsideElement);
  });

  it('calls onClickInside when clicking on the node itself', () => {
    const onClickInside = jest.fn();
    const onClickOutside = jest.fn();

    renderHook(() =>
      useClicksOutside({
        node: container,
        onClickInside,
        onClickOutside,
      })
    );

    container.click();

    expect(onClickInside).toHaveBeenCalledTimes(1);
    expect(onClickOutside).not.toHaveBeenCalled();
  });

  it('calls onClickInside when clicking on a child of the node', () => {
    const child = document.createElement('button');
    container.appendChild(child);

    const onClickInside = jest.fn();
    const onClickOutside = jest.fn();

    renderHook(() =>
      useClicksOutside({
        node: container,
        onClickInside,
        onClickOutside,
      })
    );

    child.click();

    expect(onClickInside).toHaveBeenCalledTimes(1);
    expect(onClickOutside).not.toHaveBeenCalled();
  });

  it('calls onClickOutside when clicking outside the node', () => {
    const onClickInside = jest.fn();
    const onClickOutside = jest.fn();

    renderHook(() =>
      useClicksOutside({
        node: container,
        onClickInside,
        onClickOutside,
      })
    );

    outsideElement.click();

    expect(onClickOutside).toHaveBeenCalledTimes(1);
    expect(onClickInside).not.toHaveBeenCalled();
  });

  it('calls onClickOutside when clicking on document body', () => {
    const onClickInside = jest.fn();
    const onClickOutside = jest.fn();

    renderHook(() =>
      useClicksOutside({
        node: container,
        onClickInside,
        onClickOutside,
      })
    );

    document.body.click();

    expect(onClickOutside).toHaveBeenCalledTimes(1);
    expect(onClickInside).not.toHaveBeenCalled();
  });

  it('removes event listener on unmount', () => {
    const onClickInside = jest.fn();
    const onClickOutside = jest.fn();

    const {unmount} = renderHook(() =>
      useClicksOutside({
        node: container,
        onClickInside,
        onClickOutside,
      })
    );

    unmount();

    container.click();
    outsideElement.click();

    expect(onClickInside).not.toHaveBeenCalled();
    expect(onClickOutside).not.toHaveBeenCalled();
  });

  it('handles multiple clicks correctly', () => {
    const onClickInside = jest.fn();
    const onClickOutside = jest.fn();

    renderHook(() =>
      useClicksOutside({
        node: container,
        onClickInside,
        onClickOutside,
      })
    );

    container.click();
    outsideElement.click();
    container.click();
    outsideElement.click();
    outsideElement.click();

    expect(onClickInside).toHaveBeenCalledTimes(2);
    expect(onClickOutside).toHaveBeenCalledTimes(3);
  });

  it('updates callbacks when props change', () => {
    const onClickInside1 = jest.fn();
    const onClickOutside1 = jest.fn();
    const onClickInside2 = jest.fn();
    const onClickOutside2 = jest.fn();

    const {rerender} = renderHook(
      ({onClickInside, onClickOutside}) =>
        useClicksOutside({
          node: container,
          onClickInside,
          onClickOutside,
        }),
      {
        initialProps: {
          onClickInside: onClickInside1,
          onClickOutside: onClickOutside1,
        },
      }
    );

    container.click();
    expect(onClickInside1).toHaveBeenCalledTimes(1);

    rerender({
      onClickInside: onClickInside2,
      onClickOutside: onClickOutside2,
    });

    container.click();
    expect(onClickInside1).toHaveBeenCalledTimes(1);
    expect(onClickInside2).toHaveBeenCalledTimes(1);
  });

  it('handles deeply nested child clicks as inside', () => {
    const parent = document.createElement('div');
    const child = document.createElement('div');
    const grandchild = document.createElement('span');

    container.appendChild(parent);
    parent.appendChild(child);
    child.appendChild(grandchild);

    const onClickInside = jest.fn();
    const onClickOutside = jest.fn();

    renderHook(() =>
      useClicksOutside({
        node: container,
        onClickInside,
        onClickOutside,
      })
    );

    grandchild.click();

    expect(onClickInside).toHaveBeenCalledTimes(1);
    expect(onClickOutside).not.toHaveBeenCalled();
  });

  it('works with different node types', () => {
    const button = document.createElement('button');
    document.body.appendChild(button);

    const onClickInside = jest.fn();
    const onClickOutside = jest.fn();

    renderHook(() =>
      useClicksOutside({
        node: button,
        onClickInside,
        onClickOutside,
      })
    );

    button.click();
    expect(onClickInside).toHaveBeenCalledTimes(1);

    container.click();
    expect(onClickOutside).toHaveBeenCalledTimes(1);

    document.body.removeChild(button);
  });
});
