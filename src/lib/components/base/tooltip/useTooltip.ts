import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  arrow,
} from '@floating-ui/react';
import type {Placement} from '@floating-ui/react';
import type {MutableRefObject} from 'react';
import {useMemo, useRef, useState} from 'react';

interface TooltipOptions {
  initialOpen?: boolean;
  placement?: Placement;
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export default function useTooltip({
  initialOpen = false,
  placement = 'top',
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: TooltipOptions = {}): {
  arrowRef: MutableRefObject<null>;
  open: boolean;
  setOpen: (isOpen: boolean) => void;
} & ReturnType<typeof useInteractions> &
  ReturnType<typeof useFloating> {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const arrowRef = useRef(null);
  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        crossAxis: placement.includes('-'),
        fallbackAxisSideDirection: 'start',
        padding: 5,
      }),
      shift({padding: 5}),
      arrow({
        element: arrowRef,
      }),
    ],
  });

  const context = data.context;

  const hover = useHover(context, {
    move: false,
    enabled: controlledOpen == null,
  });
  const focus = useFocus(context, {
    enabled: controlledOpen == null,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context, {role: 'tooltip'});

  const interactions = useInteractions([hover, focus, dismiss, role]);

  return useMemo(
    () => ({
      arrowRef,
      open,
      setOpen,
      ...interactions,
      ...data,
    }),
    [open, setOpen, interactions, data]
  );
}
