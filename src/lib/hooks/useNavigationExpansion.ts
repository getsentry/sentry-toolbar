import {useEffect, useRef, useState} from 'react';
import {useLocation} from 'react-router-dom';
import useLocalStorage from 'toolbar/hooks/useLocalStorage';

export default function useNavigationExpansion() {
  const {pathname} = useLocation();

  const timeoutRef = useRef<null | ReturnType<typeof setTimeout>>(null);
  const [isDelayedOpen, setIsDelayedOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useLocalStorage('useNavigationExpansion_isPinned', false);

  useEffect(() => {
    if (isPinned || isHovered) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = null;
    } else if (!isHovered) {
      setIsDelayedOpen(true);
      timeoutRef.current = setTimeout(() => {
        setIsDelayedOpen(false);
      }, 2_000);
    }
  }, [isHovered, isPinned]);

  return {
    isExpanded: pathname !== '/' || isPinned || isHovered || isDelayedOpen,
    isPinned,
    setIsHovered,
    setIsPinned,
  };
}
