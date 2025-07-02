import {useEffect} from 'react';

interface Props {
  node: Node;
  onClickInside: () => void;
  onClickOutside: () => void;
}

/**
 * Count clicks outside of a node, or clicks on the node itself.
 *
 * After `numClicks` clicks happen outside of the node, we'll invoke the callback.
 * If a click happens inside the node, the click count is reset.
 */
export default function useClicksOutside({node, onClickInside, onClickOutside}: Props) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (node === e.target || node.contains(e.target as Node)) {
        onClickInside();
      } else {
        onClickOutside();
      }
    };
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [node, onClickInside, onClickOutside]);
}
