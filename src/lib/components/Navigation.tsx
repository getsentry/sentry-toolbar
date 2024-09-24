import {Fragment, useEffect, useRef, useState} from 'react';
import IconIssues from 'toolbar/components/icon/IconIssues';
import IconPin from 'toolbar/components/icon/IconPin';
import IconSentry from 'toolbar/components/icon/IconSentry';
import IconSettings from 'toolbar/components/icon/IconSettings';
import IconButton from 'toolbar/components/navigation/IconButton';
import NavButton from 'toolbar/components/navigation/NavButton';

export default function Navigation() {
  const timeoutRef = useRef<null | ReturnType<typeof setTimeout>>(null);
  const [isDelayedOpen, setIsDelayedOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

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

  return (
    <div
      className="flex flex-col items-center gap-0.5 rounded-xl border border-red-100 bg-white p-0.5 text-black shadow-lg"
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}>
      {isPinned || isHovered || isDelayedOpen ? (
        <Fragment>
          <span className="p-1">
            <IconSentry size="md" />
          </span>

          <hr className="m-0 w-full" />

          <NavButton to="/settings" label="Settings" icon={<IconSettings />} />
          <NavButton to="/issues" label="Issues" icon={<IconIssues />} />

          <hr className="m-0 w-full" />

          <IconButton
            onClick={() => setIsPinned(!isPinned)}
            title={isPinned ? 'Allow collapsing' : 'Keep the toolbar open'}
            icon={<IconPin isSolid={isPinned} />}
          />
        </Fragment>
      ) : (
        <span className="p-1">
          <IconSentry size="md" />
        </span>
      )}
    </div>
  );
}
