import {useMergeRefs, FloatingPortal, FloatingArrow} from '@floating-ui/react';
import type {Placement} from '@floating-ui/react';
import {cx} from 'cva';
import type {HTMLProps, ReactNode} from 'react';
import {cloneElement, createContext, forwardRef, isValidElement, useContext} from 'react';
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

export const TooltipTrigger = forwardRef<HTMLElement, HTMLProps<HTMLElement> & {asChild?: boolean}>(
  function TooltipTrigger(
    {children, asChild = false, ...props}: HTMLProps<HTMLElement> & {asChild?: boolean},
    propRef
  ) {
    const context = useTooltipContext();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const childrenRef = (children as any).ref;
    const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

    // `asChild` allows the user to pass any element as the anchor
    if (asChild && isValidElement(children)) {
      return cloneElement(
        children,
        context.getReferenceProps({
          ref,
          ...props,
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
);

export const TooltipContent = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(function TooltipContent(
  {children, className, style, ...props}: HTMLProps<HTMLDivElement>,
  propRef
) {
  const portalTarget = useContext(PortalTargetContext);
  const context = useTooltipContext();

  const ref = useMergeRefs([context.refs.setFloating, propRef]);
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
          ref={context.arrowRef}
          context={context.context}
          stroke="var(--translucent-gray-200)"
          strokeWidth={1}
          fill="var(--surface-400)"
        />
        {children}
      </div>
    </FloatingPortal>
  );
});
