import {cva, cx} from 'cva';
import {Fragment, useCallback, useContext, useEffect, useRef, useState} from 'react';
import {useConfigContext} from 'toolbar/context/ConfigContext';
import ReactMountContext from 'toolbar/context/ReactMountContext';
import ShadowRootContext from 'toolbar/context/ShadowRootContext';
import {useLocalStorage} from 'toolbar/hooks/useStorage';
import type {Configuration} from 'toolbar/types/Configuration';
import {hydratePlacement} from 'toolbar/utils/hydrateConfig';

interface Coord {
  x: number;
  y: number;
}
type MaybeCoord = null | Coord;

function hasGrabberAncestor(element: Element | null) {
  return element?.hasAttribute('data-grabber') || element?.closest('[data-grabber]') !== null;
}

interface Props {
  instanceName: string;
}

export default function DragDropPositionSurface({instanceName}: Props) {
  const [storedPosition, setStoredPosition] = useLocalStorage<string>(`${instanceName}_position`, 'unknown');

  const [, setConfig] = useConfigContext();
  useEffect(
    () => setConfig(prev => ({...prev, placement: hydratePlacement(storedPosition) as Configuration['placement']})),
    [storedPosition, setConfig]
  );

  const handlePositionChange = useCallback(
    (position: string) => setStoredPosition(hydratePlacement(position)),
    [setStoredPosition]
  );

  const {mousePosition, lastPosition} = useDragDropPositionSurface({onPositionChange: handlePositionChange});

  if (!mousePosition) {
    return null;
  }

  return (
    <Fragment>
      <DropTargets />
      <GrabberGhost mousePosition={mousePosition} position={lastPosition as Configuration['placement']} />
    </Fragment>
  );
}

function useDragDropPositionSurface({onPositionChange}: {onPositionChange: (position: string) => void}) {
  const shadowRoot = useContext(ShadowRootContext);
  const reactMount = useContext(ReactMountContext);

  const [mousePosition, setMousePosition] = useState<MaybeCoord>(null);
  const lastPositionRef = useRef<string>('unknown');

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (hasGrabberAncestor(target)) {
        reactMount.addEventListener('mousemove', handleMouseMove);
        reactMount.addEventListener('mouseup', handleMouseUp);
        reactMount.style.userSelect = 'none';
        setMousePosition({x: e.clientX, y: e.clientY});
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({x: e.clientX, y: e.clientY});
      lastPositionRef.current =
        shadowRoot.elementFromPoint(e.clientX, e.clientY)?.getAttribute('data-name') ?? 'unknown';
    };

    const handleMouseUp = (_e: MouseEvent) => {
      setMousePosition(null);
      if (lastPositionRef.current !== 'unknown') {
        onPositionChange(lastPositionRef.current);
      }
      lastPositionRef.current = 'unknown';
      reactMount.style.userSelect = 'auto';
      reactMount.removeEventListener('mousemove', handleMouseMove);
      reactMount.removeEventListener('mouseup', handleMouseUp);
    };

    reactMount.addEventListener('mousedown', handleMouseDown);
    return () => {
      reactMount.removeEventListener('mousedown', handleMouseDown);
    };
  }, [reactMount, onPositionChange, shadowRoot]);

  return {mousePosition, lastPosition: lastPositionRef.current};
}

const ghostPositionClass = cva('', {
  variants: {
    position: {
      'top-left-corner': ['h-[52px] w-[187px]'],
      'top-edge': ['h-[52px] w-[187px]'],
      'top-right-corner': ['h-[52px] w-[187px]'],
      'bottom-left-corner': ['h-[52px] w-[187px]'],
      'bottom-edge': ['h-[52px] w-[187px]'],
      'bottom-right-corner': ['h-[52px] w-[187px]'],
      'left-top-corner': ['h-[187px] w-[52px]'],
      'left-edge': ['h-[187px] w-[52px]'],
      'left-bottom-corner': ['h-[187px] w-[52px]'],
      'right-top-corner': ['h-[187px] w-[52px]'],
      'right-edge': ['h-[187px] w-[52px]'],
      'right-bottom-corner': ['h-[187px] w-[52px]'],
    } satisfies Record<Configuration['placement'], string[]>,
  },
});

const grabberGhostClass = cx([
  '-translate-x-1/2',
  '-translate-y-1/2',
  'absolute',
  'bg-white',
  'border-solid',
  'border-translucentGray-200',
  'border',
  'cursor-grab',
  'pointer-events-none',
  'rounded-full',
  'rounded-xl',
  'shadow-lg',
  'shadow-shadow-heavy',
  'z-dragdrop',
]);

function GrabberGhost({mousePosition, position}: {mousePosition: Coord; position: Configuration['placement']}) {
  return (
    <div
      className={cx(grabberGhostClass, ghostPositionClass({position}))}
      style={{left: mousePosition.x, top: mousePosition.y}}
    />
  );
}

const targetWrapperClass = cx('group pointer-events-none absolute inset-0');
const targetShapeBaseClass = cx('absolute inset-0 pointer-events-auto cursor-grab');
const targetShapeClasses = {
  'top-left-corner': cx(targetShapeBaseClass, '[clip-path:polygon(0%_0%,33.33%_33.33%,33.33%_0%)]'),
  'top-edge': cx(targetShapeBaseClass, '[clip-path:polygon(33.33%_0%,66.66%_0%,66.66%_33.33%,33.33%_33.33%)]'),
  'top-right-corner': cx(targetShapeBaseClass, '[clip-path:polygon(100%_0%,66.66%_0%,66.66%_33.33%)]'),
  'bottom-left-corner': cx(targetShapeBaseClass, '[clip-path:polygon(0%_100%,33.33%_66.66%,33.33%_100%)]'),
  'bottom-edge': cx(targetShapeBaseClass, '[clip-path:polygon(33.33%_66.66%,66.66%_66.66%,66.66%_100%,33.33%_100%)]'),
  'bottom-right-corner': cx(targetShapeBaseClass, '[clip-path:polygon(66.66%_66.66%,100%_100%,66.66%_100%)]'),
  'left-top-corner': cx(targetShapeBaseClass, '[clip-path:polygon(0%_0%,33.33%_33.33%,0%_33.33%)]'),
  'left-edge': cx(targetShapeBaseClass, '[clip-path:polygon(0%_33.33%,33.33%_33.33%,33.33%_66.66%,0%_66.66%)]'),
  'left-bottom-corner': cx(targetShapeBaseClass, '[clip-path:polygon(0%_100%,33.33%_66.66%,0%_66.66%)]'),
  'right-top-corner': cx(targetShapeBaseClass, '[clip-path:polygon(100%_0%,100%_33.33%,66.66%_33.33%)]'),
  'right-edge': cx(targetShapeBaseClass, '[clip-path:polygon(66.66%_33.33%,100%_33.33%,100%_66.66%,66.66%_66.66%)]'),
  'right-bottom-corner': cx(targetShapeBaseClass, '[clip-path:polygon(66.66%_66.66%,100%_66.66%,100%_100%)]'),
} satisfies Record<Configuration['placement'], string>;
const targetGhostClass = cva(
  [
    'hidden',
    'group-hover:block',
    'absolute',
    'bg-translucentSurface-100',
    'border-dashed',
    'border-translucentGray-200',
    'border',
    'pointer-events-none',
    'rounded-full',
    'rounded-xl',
    'shadow-lg',
    'shadow-shadow-heavy',
    'z-initial',
  ],
  {
    variants: {
      position: {
        'top-left-corner': ['left-2 top-2'],
        'top-edge': ['left-1/2 top-2 -translate-x-1/2'],
        'top-right-corner': ['right-2 top-2'],
        'bottom-left-corner': ['bottom-2 left-2'],
        'bottom-edge': ['bottom-2 left-1/2 -translate-x-1/2'],
        'bottom-right-corner': ['bottom-2 right-2'],
        'left-top-corner': ['left-2 top-2'],
        'left-edge': ['left-2 top-1/2 -translate-y-1/2'],
        'left-bottom-corner': ['bottom-2 left-2'],
        'right-top-corner': ['right-2 top-2'],
        'right-edge': ['right-2 top-1/2 -translate-y-1/2'],
        'right-bottom-corner': ['bottom-2 right-2'],
      } satisfies Record<Configuration['placement'], string[]>,
    },
  }
);

function DropTargets() {
  return (
    <div className="pointer-events-auto absolute inset-0 z-dragdrop">
      {Object.entries(targetShapeClasses).map(([position, className]) => (
        <div key={position} className={targetWrapperClass}>
          <div data-name={position} className={className} />
          <div
            className={cx(
              targetGhostClass({position: position as Configuration['placement']}),
              ghostPositionClass({position: position as Configuration['placement']})
            )}
          />
        </div>
      ))}

      {/* Center section, not a drop target */}
      <div className={targetWrapperClass}>
        <div
          className={cx(
            targetShapeBaseClass,
            'cursor-not-allowed [clip-path:polygon(25%_25%,75%_25%,75%_75%,25%_75%)]'
          )}
        />
      </div>
    </div>
  );
}
