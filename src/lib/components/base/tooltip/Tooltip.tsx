import {useMergeRefs, FloatingPortal, FloatingArrow} from '@floating-ui/react';
import type {Placement} from '@floating-ui/react';
import {cx} from 'cva';
import type {HTMLProps, ReactNode, Ref} from 'react';
import {cloneElement, createContext, isValidElement, useContext} from 'react';
import useTooltip from 'toolbar/components/base/tooltip/useTooltip';
import PortalTargetContext from 'toolbar/context/PortalTargetContext';

interface TooltipOptions {
  initialOpen?: boolean;
  placement?: Placement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

type ContextType = ReturnType<typeof useTooltip> | null;

const TooltipContext = createContext<ContextType>(null);

function useTooltipContext() {
  const context = useContext(TooltipContext);

  if (context == null) {
    throw new Error('Tooltip components must be wrapped in <Tooltip />');
  }

  return context;
}

export function Tooltip({children, ...options}: {children: ReactNode} & TooltipOptions) {
  // This can accept any props as options, e.g. `placement`,
  // or other positioning options.
  const tooltip = useTooltip(options);
  return <TooltipContext.Provider value={tooltip}>{children}</TooltipContext.Provider>;
}

export function TooltipTrigger({
  children,
  asChild = false,
  ref: propRef,
  ...props
}: HTMLProps<HTMLElement> & {asChild?: boolean}) {
  const context = useTooltipContext();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const childrenRef = (children as any).ref;
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

  // `asChild` allows the user to pass any element as the anchor
  if (asChild && isValidElement(children)) {
    return cloneElement(
      children,
      // eslint-disable-next-line react-hooks/refs
      context.getReferenceProps({
        ref,
        ...props,
        // @ts-expect-error TS2698: Spread types may only be created from object types.
        ...children.props,
        'data-state': context.open ? 'open' : 'closed',
      })
    );
  }

  return (
    <button
      ref={ref}
      className="cursor-default"
      // The user can style the trigger based on the state
      data-state={context.open ? 'open' : 'closed'}
      {...context.getReferenceProps(props)}>
      {children}
    </button>
  );
}

export function TooltipContent({children, className, style, ref: propRef, ...props}: HTMLProps<HTMLDivElement>) {
  const portalTarget = useContext(PortalTargetContext);
  const context = useTooltipContext();

  const ref = useMergeRefs([context.refs.setFloating, propRef as Ref<HTMLDivElement>]);
  if (!context.open) {
    return null;
  }

  return (
    <FloatingPortal root={portalTarget}>
      <div
        ref={ref}
        style={{
          ...context.floatingStyles,
          ...style,
        }}
        className={cx(
          'max-w-60 rounded-md text-xs text-gray-400 bg-surface-400 px-1.5 py-1 shadow-sm shadow-shadow-heavy border border-translucentGray-200 z-tooltip',
          className
        )}
        {...context.getFloatingProps(props)}>
        <FloatingArrow
          // eslint-disable-next-line react-hooks/refs
          ref={context.arrowRef}
          // eslint-disable-next-line react-hooks/refs
          context={context.context}
          stroke="var(--translucent-gray-200)"
          strokeWidth={1}
          fill="var(--surface-400)"
        />
        {children}
      </div>
    </FloatingPortal>
  );
}
